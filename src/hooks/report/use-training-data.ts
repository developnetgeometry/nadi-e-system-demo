import { useEffect, useState } from "react";

type TrainingData = {
    id: string;
}

export const useTrainingData = (
    duspFilter: (string | number)[],
    phaseFilter: string | number | null,
    monthFilter: string | number | null,
    yearFilter: string | number | null,
    tpFilter: (string | number)[] = []
) => {
    const [trainingData, setTrainingData] = useState<TrainingData[]>([]); // Replace 'any' with your actual data type
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        setLoading(false);
        setError(null);

    }, [duspFilter, phaseFilter, monthFilter, yearFilter, tpFilter]);

    return {
        trainingData,
        loading,
        error
    };
};
