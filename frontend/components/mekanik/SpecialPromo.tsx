
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Gift } from 'lucide-react';

const SpecialPromo = () => {
  return (
    <Card className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Promo Spesial Bulan Ini!</CardTitle>
        <Gift className="h-5 w-5 text-white" />
      </CardHeader>
      <CardContent>
        <div className="text-lg font-bold">Diskon 15% untuk Servis AC</div>
        <p className="text-xs text-white/90">Berlaku hingga akhir bulan. Tawarkan ke pelanggan!</p>
      </CardContent>
    </Card>
  );
};

export default SpecialPromo;
