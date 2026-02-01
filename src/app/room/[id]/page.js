import SyncRoom from '@/components/SyncRoom';

export default async function RoomPage({ params }) {
    const { id } = await params;
    return <SyncRoom roomId={id} />;
}
