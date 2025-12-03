import DashboardSidebar from '@/components/DashboardSidebar';
import MapaView from '@/views/MapaView';

const CollectionMap = () => {
  return (
    <div className="min-h-screen bg-background flex">
      <DashboardSidebar />
      <div className="flex-1 lg:ml-64">
        <MapaView />
      </div>
    </div>
  );
};

export default CollectionMap;
