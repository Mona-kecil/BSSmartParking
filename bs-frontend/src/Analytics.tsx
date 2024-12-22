import { useState, useEffect } from 'react'

interface CardProps {
  title: string;
  value?: number;
  revenue?: number;
}

interface AnalyticsData {
  vehicles_entered_today: number;
  vehicles_exited_today: number;
  revenue_collected_today: number;
  vehicles_entered_in_last_hour: number;
  vehicles_exited_in_last_hour: number;
}

export default function Analytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/analytics');
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
        const responseData = await response.json();
        const analytics: AnalyticsData = responseData.data
        setData(analytics);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        }
      } finally {
        setLoading(false);
      }
    }

    fetchAnalytics();

    const analyticsId = setInterval(fetchAnalytics, 60 * 1000);

    return () => clearInterval(analyticsId)
  }, []);

  if (error) return <div>Error: {error}</div>
  if (loading) return <div>Loading...</div>

  const vehiclesEnteredToday = data?.vehicles_entered_today ?? 0;
  const vehiclesExitedToday = data?.vehicles_exited_today ?? 0;
  const revenueCollectedToday = data?.revenue_collected_today ?? 0;
  const vehiclesEnteredLastHour = data?.vehicles_entered_in_last_hour ?? 0;
  const vehiclesExitedLastHour = data?.vehicles_exited_in_last_hour ?? 0;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="font-sans font-semibold text-3xl">Analytics</h1>
      <div className="flex flex-row justify-between gap-4">
        <Card title='Vehicles entered today' value={vehiclesEnteredToday} />
        <Card title='Vehicles exited today' value={vehiclesExitedToday} />
        <Card title='Revenue collected today' revenue={revenueCollectedToday} />
        <Card title='Vehicles entered in last hour' value={vehiclesEnteredLastHour} />
        <Card title='Vehicles exited in last hour' value={vehiclesExitedLastHour} />
      </div>
    </div>
  )
}

function Card({ title, value, revenue }: CardProps) {

  const formatted_value = revenue
    ? new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(revenue)
    : value;

  return (
    <div className="flex flex-col flex-wrap max-w-md border-[1px] border-slate-300 rounded-xl p-6 gap-2 shadow-lg">
      <h2 className="font-sans text-black/50">{title}</h2>
      <h3 className="font-sans font-extrabold text-2xl">{formatted_value}</h3>
    </div>
  )

}
