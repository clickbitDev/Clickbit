import React from 'react';

const UptimeKumaPage: React.FC = () => {
  const uptimeKumaUrl = 'https://status.clickbit.com.au/dashboard';

  return (
    <div className="w-full -mx-4 -my-1 lg:-mx-8 lg:-my-2" style={{ height: 'calc(100vh - 5rem)' }}>
      <iframe
        src={uptimeKumaUrl}
        className="w-full h-full border-0"
        title="Uptime Kuma Status Page"
        allow="fullscreen"
      />
    </div>
  );
};

export default UptimeKumaPage;

