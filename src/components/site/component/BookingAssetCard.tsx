import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardFooter, CardDescription } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { Plus, Server, SquarePen } from "lucide-react";
import { BulkActionButtons } from "./BulkActionButtons";
import { Button } from "@/components/ui/button";

interface DataCardProps {
    assetType: string;
    assetSpec: string;
    started?: React.ReactNode;
    icon?: React.ReactNode;
    className?: string;
    requesterName: string;
    AssetName?: string;
    label?: React.ReactNode
    duration?: string;
    status?: string;
    isFacility?: boolean;
    children?: React.ReactNode;
}

export const BookingAssetCard = ({
    assetType,
    assetSpec,
    started,
    AssetName,
    status,
    isFacility,
    requesterName,
    duration,
    label,
    icon,
    className,
    children,
}: DataCardProps) => {
    return (
        <Dialog>
            <DialogTrigger>
                <Card className={cn("h-full scale-100 transition-transform duration-200 ease-in-out", className)}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div className='flex items-center justify-center gap-3'>
                            {icon && <div className="h-4 flex justify-center items-center w-4 text-muted-foreground">{icon}</div>}
                            <CardTitle className="text-lg font-medium">{assetType}</CardTitle>
                        </div>
                        {(label)}
                    </CardHeader>
                    <CardContent className='flex flex-col justify-center items-center'>
                        <div className="text-xl font-light">{AssetName}</div>
                        {assetSpec && (
                            <CardDescription className="text-xs text-muted-foreground mt-1">
                                {assetSpec}
                            </CardDescription>
                        )}
                        {requesterName && (
                            <CardDescription className='font-semibold text-base mt-2 text-black'>
                                {requesterName}
                            </CardDescription>
                        )}
                        {children}
                        {isFacility && (
                            <div className="w-full flex items-center justify-between gap-1 mt-3">
                                {status === "in-use" || status === "Maintenance" ? (
                                    <Button size="sm" className="bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 px-2 py-0.5 flex items-center text-[11px] gap-1 w-fit">
                                        <SquarePen className="h-2 w-2" />
                                        Report Issue
                                    </Button>
                                ) : (
                                    <>
                                        <Button size="sm" className="flex flex-grow items-center px-2 py-0.5 text-[11px] gap-1 w-fit">
                                            <Plus className="h-2 w-2" />
                                            Reserve Now
                                        </Button>
                                        <Button size="sm" className="bg-white flex-grow hover:bg-gray-50 text-gray-700 border border-gray-300 px-2 py-0.5 flex items-center text-[11px] gap-1 w-fit">
                                            <SquarePen className="h-2 w-2" />
                                            Report Issue
                                        </Button>
                                    </>
                                )}
                            </div>
                        )}
                    </CardContent>
                    {(started !== "-" && duration !== "-") && <CardFooter className="pt-1 flex justify-center items-center text-[10px] font-light text-gray-500">{`Started: ${started} | Duration: ${duration}`}</CardFooter>}
                </Card>
            </DialogTrigger>
            {!isFacility ? (
                <BookingPcCardDetails 
                    name={AssetName}
                    status={status}
                    duration={duration}
                />
            ) : (
                <BookingFacilityCardDetails
                />
            )}
        </Dialog>
    );
};

interface BookingPcCardDetailsProps {
    name: string,
    status: string,
    duration: string,
}

const BookingPcCardDetails = ({
    name,
    status,
    duration
}: BookingPcCardDetailsProps) => {

    const aboutPc = [
        {
            title: "Time Remaining",
            description: duration === "-" ? "Not In Use" : duration
        },
        {
            title: "Status",
            description: status
        },
        {
            title: "Application History",
            description: "No Application History"
        },
        {
            title: "Network History",
            description: "No Network History"
        },
    ];

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2 text-xl font-bold justify-start">
                    <Server />
                    {name}
                </DialogTitle>
            </DialogHeader>
            <BulkActionButtons
                className="grid grid-cols-2 mt-0"
                useHeader={false}
            />
            <div className="flex flex-col gap-4">
                {aboutPc.map((pc) => (
                    <div className="flex flex-col items-start">
                        <h5 className="font-semibold text-base">{pc.title}:</h5>
                        <small className="text-gray-600">{pc.description}</small>
                    </div>
                ))}
            </div>
        </DialogContent>
    )
}

interface BookingFacilityCardDetailsProps {
    
}

const BookingFacilityCardDetails = () => {

    return (
        <DialogContent>
            <h1>SOON: Dialog content for facility</h1>
        </DialogContent>
    )
}

export default BookingAssetCard;