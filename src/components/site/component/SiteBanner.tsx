
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Image } from 'lucide-react';

interface SiteBannerProps {
    name: string;
    type: string;
    bannerImage: string;
}

const SiteBanner: React.FC<SiteBannerProps> = ({ name, type, bannerImage }) => {
    return (
        <div className="relative w-full h-60 overflow-hidden rounded-t-lg">
            <img
                src={bannerImage}
                alt={`${name} banner`}
                className="w-full object-cover"
            />
            <div className="absolute bottom-0 left-0 w-full p-4 bg-gradient-to-t from-black/70 to-transparent">
                <h1 className="text-2xl font-bold text-white">{name}</h1>
                <Badge className="mt-1 bg-gray-600 dark:bg-gray-800 hover:bg-gray-600">
                    {type}
                </Badge>
            </div>
        </div>
    );
};

export default SiteBanner;
