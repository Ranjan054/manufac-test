import React, { useEffect, useState } from 'react'
import { WineData } from '../../types/Homepage/index';
import wineDataJson from '../../data/wineData.json';
import './Homepage.css'

const Homepage: React.FC = () => {
    const [classWiseStats, setClassWiseStats] = useState<{ [key: string]: { mean: number, median: number, mode: number } }>({});

    const wineData: WineData[] = wineDataJson;

    useEffect(() => {
        const calculateClassWiseStats = () => {
            const classStats: { [key: string]: number[] } = {};

            wineData.forEach((item) => {
                const alcoholClass = item.Alcohol.toString();
                if (!classStats[alcoholClass]) {
                    classStats[alcoholClass] = [];
                }
                classStats[alcoholClass].push(+item.Flavanoids);
            });

            const result: { [key: string]: { mean: number; median: number; mode: number } } = {};

            for (const classId in classStats) {
                if (classStats.hasOwnProperty(classId)) {
                    const flavanoidsData = classStats[classId];

                    // Calculate mean
                    const mean = flavanoidsData.reduce((acc, val) => acc + val, 0) / flavanoidsData.length;

                    // Calculate median
                    const sortedFlavanoids = [...flavanoidsData].sort((a, b) => a - b);
                    const middle = Math.floor(sortedFlavanoids.length / 2);
                    const median = sortedFlavanoids.length % 2 === 0
                        ? (sortedFlavanoids[middle - 1] + sortedFlavanoids[middle]) / 2
                        : sortedFlavanoids[middle];

                    // Calculate mode
                    const mode = flavanoidsData.reduce((acc, val) => {
                        acc[val] = (acc[val] || 0) + 1;
                        return acc;
                    },
                        {} as { [key: number]: number }
                    );

                    const modeValue = +Object.keys(mode).reduce((a: any, b: any) => (mode[a] > mode[b] ? a : b));

                    result[classId] = { mean, median, mode: modeValue };
                }
            }
            setClassWiseStats(result);
        };

        calculateClassWiseStats();
    }, [wineData])

    return (
        <div className='container'>
            <div className='center-content'>
                {
                    Object.keys(classWiseStats).length > 0 ? (
                        <div className='table-wrapper'>
                            <div className='table-left-heading'>
                                <div className='th top-d'> <p>Measure</p></div>
                                <div className='th other-d'>
                                    <p>
                                        Flavanoids
                                        <br /> Mean
                                    </p>
                                </div>
                                <div className='th other-d'>
                                    <p>
                                        Flavanoids
                                        <br /> Median
                                    </p>
                                </div>
                                <div className='th other-d'>
                                    <p>
                                        Flavanoids
                                        <br /> Mode
                                    </p>
                                </div>
                            </div>
                            {
                                Object.entries(classWiseStats).map(([classId, stats]) => (
                                    <div key={classId.toString()} className='table-column'>
                                        <div className='td top-d row-heading'>class {classId}</div>
                                        <div className='td other-d'>{stats.mean.toFixed(3)}</div>
                                        <div className='td other-d'>{stats.median.toFixed(3)}</div>
                                        <div className='td other-d'>{stats.mode.toFixed(3)}</div>
                                    </div>
                                ))
                            }
                        </div>
                    ) : (<p className='loading'>Loading...</p>)
                }
            </div>
        </div>
    )
}

export default Homepage;