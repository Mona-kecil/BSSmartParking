from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.models.database import get_connection

router = APIRouter()


class Analytics(BaseModel):
    vehicles_entered_today: int
    vehicles_exited_today: int
    revenue_collected_today: int
    vehicles_entered_in_last_hour: int
    vehicles_exited_in_last_hour: int


@router.get('/analytics')
def get_aggregated_analytics():
    try:
        with get_connection() as conn:
            cursor = conn.cursor()

            cursor.execute('''
            select
                count(case when date(entry_time) = date('now', 'localtime') then 1 end) as vehicles_entered_today,
                count(case when date(exit_time) = date('now', 'localtime') then 1 end) as vehicles_exited_today,
                coalesce(sum(p.amount), 0) as revenue_collected_today,
                count(case when datetime(entry_time) >= datetime('now', '-1 hour') then 1 end) as vehicles_entered_in_last_hour,
                count(case when datetime(exit_time) >= datetime('now', '-1 hour') then 1 end) as vehicles_exited_in_last_hour
            from parking_sessions ps
            left join payments p on ps.id = p.parking_session_id
            ''')

            result = cursor.fetchone()
            if result:
                analytics = Analytics(
                    vehicles_entered_today=result[0],
                    vehicles_exited_today=result[1],
                    revenue_collected_today=result[2],
                    vehicles_entered_in_last_hour=result[3],
                    vehicles_exited_in_last_hour=result[4]
                )
                return {
                    'message': 'success',
                    'data': dict(analytics),
                }
            else:
                raise HTTPException(
                    status_code=404, detail="No analytics data found.")

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Server error: {e}")
