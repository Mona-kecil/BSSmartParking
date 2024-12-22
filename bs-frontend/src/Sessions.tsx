import { useState, useEffect, memo } from 'react'

type ISODateString = string;

interface SessionCardProps {
  license_plate: string;
  start_time: ISODateString;
}

interface Session {
  id: string;
  license_plate: string;
  entry_time: ISODateString;
  exit_time?: ISODateString;
  created_at: ISODateString;
  deleted_at?: ISODateString;
}

export default function Sessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSessions = async () => {
      try {
        const response = await fetch('http://127.0.0.1:8000/api/v1/sessions');
        console.log(response)
        if (!response.ok) throw new Error(`HTTP error: ${response.status}`)
        const responseBody = await response.json();
        const data: Session[] = responseBody.data
        setSessions(data);

      } catch (err) {
        if (err instanceof Error) {
          setError(err.message)
        }
      } finally {
        setLoading(false)
      }
    };

    fetchSessions()

    const intervalId = setInterval(fetchSessions, 60 * 1000);

    return () => clearInterval(intervalId);

  }, []);

  if (error) return <div>Error: {error}</div>;
  if (loading) return <div>Loading...</div>;

  return (
    <div className='border-[1px] border-slate-300 rounded-xl p-4 flex flex-col gap-4'>
      <h2 className='font-sans font-semibold text-3xl'>Active Sessions</h2>
      {sessions.length > 0
        ? (sessions.map(session => (
          <SessionCard key={session.id} license_plate={session.license_plate} start_time={session.entry_time} />
        )))
        : <p>There are no active sessions</p>
      }
    </div>
  )

}

const SessionCard = memo(({ license_plate, start_time }: SessionCardProps) => {

  const start_datetime = new Date(start_time)

  const formatted_date = start_datetime.toLocaleString('id-ID', {
    dateStyle: 'medium',
    timeStyle: 'short',
  })

  return (
    <div className='bg-slate-700 rounded-lg p-2'>
      <h3 className='font-mono font-semibold text-xl text-white'>{license_plate}</h3>
      <p className='font-sans font-light text-white/50 text-md'>{formatted_date}</p>
    </div>
  )

})
