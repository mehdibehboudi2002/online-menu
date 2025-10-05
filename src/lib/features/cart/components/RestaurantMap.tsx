'use client';

import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/lib/store/store';
import { setDeliveryTable, setIsSelectingTableLater } from '@/lib/store/features/cartSlice';
import { useTranslation } from 'react-i18next';

const RestaurantMap = () => {
    const { t, i18n } = useTranslation();
    const dark = useSelector((state: RootState) => state.theme.dark);
    const isSelectingTableLater = useSelector((state: RootState) => state.cart.deliveryDetails.isSelectingTableLater);
    const dispatch = useDispatch();

    const selectedTable = useSelector((state: RootState) => state.cart.deliveryDetails.selectedTable);

    const currentLang = i18n.language as 'en' | 'fa';
    const isFarsi = currentLang === 'fa';

    // Utility function to handle table selection/deselection
    const handleTableClick = (dispatch: ReturnType<typeof useDispatch>, selectedTable: string | null, table: string) => {
        // New logic: Check if the current table is already selected
        if (selectedTable === table) {
            dispatch(setDeliveryTable(null)); // Deselect (set to null)
        } else {
            dispatch(setDeliveryTable(table)); // Select new table
        }
    };

    // Helper to generate the click handler for a specific table
    const getClickHandler = (tableNumber: string) => () => handleTableClick(dispatch, selectedTable, tableNumber);

    return (
        <>
            {/* Table Selection */}
            {/* Interactive Table Map */}
            <div>
                <h3 className={`text-lg font-semibold mb-5 ${dark ? 'text-white' : 'text-green-900'}`}>
                    {t('cart.select_table') || 'Select Your Table'}
                </h3>

                {/* Select Table Later Checkbox */}
                <label className={`flex items-center gap-2 mb-4 p-3 rounded-2xl cursor-pointer transition-colors
                       ${dark ? 'bg-slate-700 hover:bg-slate-600' : 'bg-gray-100 hover:bg-gray-200'}`}>
                    <input
                        type="checkbox"
                        checked={isSelectingTableLater}
                        onChange={(e) => dispatch(setIsSelectingTableLater(e.target.checked))}
                        className="size-4"
                    />
                    <div>
                        <span className={`font-medium ${dark ? 'text-white' : 'text-gray-900'}`}>
                            {t('cart.select_later') || "I'll select my table at the restaurant"}
                        </span>
                        <p className={`text-xs mt-0.5 ${dark ? 'text-slate-400' : 'text-gray-600'}`}>
                            {t('cart.select_later_desc') || 'More flexible time options available'}
                        </p>
                    </div>
                </label>

                {/* SVG Map Container */}
                {!isSelectingTableLater &&
                    (<div className={`relative rounded-xl overflow-hidden border-2 ${dark ? 'border-slate-600 bg-slate-700' : 'border-green-200 bg-white'}`}>
                        <svg
                            viewBox="0 0 800 550"
                            className="w-full h-auto"
                            style={{ maxHeight: '550px' }}
                        >
                            {/* Background */}
                            <rect width="800" height="550" fill={dark ? '#334155' : '#f8fffa'} />

                            {/* Balcony Section (Top Half) */}
                            <rect
                                x="0"
                                y="0"
                                width="800"
                                height="250"
                                fill={dark ? '#3f4c5e' : '#e8f5e9'}
                                opacity="0.3"
                            />
                            <text
                                x="400"
                                y="30"
                                className={`text-lg font-semibold ${dark ? 'fill-slate-300' : 'fill-green-700'}`}
                                textAnchor="middle"
                            >
                                {t('cart.balcony') || 'BALCONY'}
                            </text>

                            {/* Salon Section (Bottom Half) */}
                            <text
                                x="400"
                                y="280"
                                className={`text-lg font-semibold ${dark ? 'fill-slate-300' : 'fill-green-700'}`}
                                textAnchor="middle"
                            >
                                {t('cart.salon') || 'SALON'}
                            </text>

                            {/* Entrance marker (top left) */}
                            <g>
                                <path
                                    d="M 0 0 L 100 0 L 100 30 Q 100 40 90 40 L 0 40 Z"
                                    fill={dark ? '#1e293b' : '#ffffff'}
                                    stroke={dark ? '#475569' : '#9ca3af'}
                                    strokeWidth="2"
                                />
                                <text
                                    x="50"
                                    y="25"
                                    className={`text-sm font-semibold ${dark ? 'fill-slate-400' : 'fill-gray-600'}`}
                                    textAnchor="middle"
                                >
                                    {t('cart.entrance') || 'ENTRANCE'}
                                </text>
                            </g>

                            {/* Decorative Plants in Balcony */}
                            <g opacity="0.6">
                                <ellipse cx="260" cy="140" rx="15" ry="20" fill="#2d5016" />
                                <circle cx="255" cy="125" r="8" fill="#4ade80" />
                                <circle cx="265" cy="128" r="7" fill="#4ade80" />
                                <circle cx="260" cy="118" r="6" fill="#22c55e" />
                            </g>

                            <g opacity="0.6">
                                <ellipse cx="540" cy="140" rx="15" ry="20" fill="#2d5016" />
                                <circle cx="535" cy="125" r="8" fill="#4ade80" />
                                <circle cx="545" cy="128" r="7" fill="#4ade80" />
                                <circle cx="540" cy="118" r="6" fill="#22c55e" />
                            </g>

                            {/* Flowers */}
                            <circle cx="350" cy="217" r="4" fill="#ec4899" />
                            <circle cx="360" cy="215" r="4" fill="#f97316" />
                            <circle cx="450" cy="217" r="4" fill="#eab308" />
                            <circle cx="440" cy="215" r="4" fill="#ec4899" />

                            {/* BALCONY TABLES */}

                            {/* Table 1 (large circle, balcony left) - 4 chairs symmetric */}
                            <g
                                onClick={getClickHandler('1')}
                                className="cursor-pointer" // Removed transition from <g>
                            >
                                <circle
                                    cx="150"
                                    cy="130"
                                    r="55"
                                    className="transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '1'
                                        ? (dark ? '#facc15' : '#16a34a')
                                        : (dark ? '#64748b' : '#e5e7eb')
                                    }
                                    stroke={dark ? '#1e293b' : '#9ca3af'}
                                    strokeWidth="3"
                                />
                                <text
                                    x="150"
                                    y="142"
                                    className="text-3xl font-bold pointer-events-none transition-all duration-300 ease-in-out"
                                    textAnchor="middle"
                                    fill={selectedTable === '1'
                                        ? (dark ? '#0f172a' : '#ffffff')
                                        : (dark ? '#cbd5e1' : '#6b7280')
                                    }
                                >
                                    {isFarsi ? '۱' : '1'}
                                </text>
                                {/* Chair indicators - symmetric */}
                                <circle cx="106" cy="130" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="150" cy="86" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="194" cy="130" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="150" cy="174" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                            </g>

                            {/* Table 2 (large oval, balcony center) - 6 chairs */}
                            <g
                                onClick={getClickHandler('2')}
                                className="cursor-pointer" // Removed transition from parent <g>
                            >
                                <ellipse
                                    cx="400"
                                    cy="130"
                                    rx="90"
                                    ry="55"
                                    className="transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '2'
                                        ? (dark ? '#facc15' : '#16a34a')
                                        : (dark ? '#64748b' : '#e5e7eb')
                                    }
                                    stroke={dark ? '#1e293b' : '#9ca3af'}
                                    strokeWidth="3"
                                />
                                <text
                                    x="400"
                                    y="142"
                                    className="text-3xl font-bold pointer-events-none transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '2'
                                        ? (dark ? '#0f172a' : '#ffffff')
                                        : (dark ? '#cbd5e1' : '#6b7280')
                                    }
                                >
                                    {isFarsi ? '۲' : '2'}
                                </text>
                                {/* Chair indicators - 6 chairs */}
                                <circle cx="330" cy="110" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="365" cy="80" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="435" cy="80" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="470" cy="110" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="470" cy="150" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="330" cy="150" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="365" cy="180" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="435" cy="180" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                            </g>

                            {/* Table 3 (large circle, balcony right) - 4 chairs symmetric */}
                            <g
                                onClick={getClickHandler('3')}
                                className="cursor-pointer" // Removed transition from parent <g>
                            >
                                <circle
                                    cx="650"
                                    cy="130"
                                    r="55"
                                    className="transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '3'
                                        ? (dark ? '#facc15' : '#16a34a')
                                        : (dark ? '#64748b' : '#e5e7eb')
                                    }
                                    stroke={dark ? '#1e293b' : '#9ca3af'}
                                    strokeWidth="3"
                                />
                                <text
                                    x="642"
                                    y="142"
                                    className="text-3xl font-bold pointer-events-none transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '3'
                                        ? (dark ? '#0f172a' : '#ffffff')
                                        : (dark ? '#cbd5e1' : '#6b7280')
                                    }
                                >
                                    {isFarsi ? '۳' : '3'}
                                </text>
                                {/* Chair indicators - symmetric */}
                                <circle cx="606" cy="130" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="650" cy="86" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="694" cy="130" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="650" cy="174" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                            </g>

                            {/* Divider line between balcony and salon */}
                            <line
                                x1="0"
                                y1="250"
                                x2="800"
                                y2="250"
                                stroke={dark ? '#475569' : '#d1d5db'}
                                strokeWidth="2"
                                strokeDasharray="10,5"
                            />

                            {/* SALON TABLES */}

                            {/* Table 4 (smaller circle, salon top-left) - 2 chairs face to face */}
                            <g
                                onClick={getClickHandler('4')}
                                className="cursor-pointer" // Removed transition from parent <g>
                            >
                                <circle
                                    cx="150"
                                    cy="330"
                                    r="40"
                                    className="transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '4'
                                        ? (dark ? '#facc15' : '#16a34a')
                                        : (dark ? '#64748b' : '#e5e7eb')
                                    }
                                    stroke={dark ? '#1e293b' : '#9ca3af'}
                                    strokeWidth="3"
                                />
                                <text
                                    x="150"
                                    y="340"
                                    className="text-3xl font-bold pointer-events-none transition-all duration-300 ease-in-out"
                                    textAnchor="middle"
                                    fill={selectedTable === '4'
                                        ? (dark ? '#0f172a' : '#ffffff')
                                        : (dark ? '#cbd5e1' : '#6b7280')
                                    }
                                >
                                    {isFarsi ? '۴' : '4'}
                                </text>
                                {/* 2 chairs face to face */}
                                <circle cx="150" cy="300" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="150" cy="360" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                            </g>

                            {/* Table 5 (smaller circle, salon top-center) - 2 chairs face to face */}
                            <g
                                onClick={getClickHandler('5')}
                                className="cursor-pointer" // Removed transition from parent <g>
                            >
                                <circle
                                    cx="325"
                                    cy="330"
                                    r="40"
                                    className="transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '5'
                                        ? (dark ? '#facc15' : '#16a34a')
                                        : (dark ? '#64748b' : '#e5e7eb')
                                    }
                                    stroke={dark ? '#1e293b' : '#9ca3af'}
                                    strokeWidth="3"
                                />
                                <text
                                    x="325"
                                    y="340"
                                    className="text-3xl font-bold pointer-events-none transition-all duration-300 ease-in-out"
                                    textAnchor="middle"
                                    fill={selectedTable === '5'
                                        ? (dark ? '#0f172a' : '#ffffff')
                                        : (dark ? '#cbd5e1' : '#6b7280')
                                    }
                                >
                                    {isFarsi ? '۵' : '5'}
                                </text>
                                {/* 2 chairs face to face */}
                                <circle cx="325" cy="300" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="325" cy="360" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                            </g>

                            {/* Table 6 (smaller circle, salon top-right) - 2 chairs face to face */}
                            <g
                                onClick={getClickHandler('6')}
                                className="cursor-pointer" // Removed transition from parent <g>
                            >
                                <circle
                                    cx="475"
                                    cy="330"
                                    r="40"
                                    className="transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '6'
                                        ? (dark ? '#facc15' : '#16a34a')
                                        : (dark ? '#64748b' : '#e5e7eb')
                                    }
                                    stroke={dark ? '#1e293b' : '#9ca3af'}
                                    strokeWidth="3"
                                />
                                <text
                                    x="475"
                                    y="340"
                                    className="text-3xl font-bold pointer-events-none transition-all duration-300 ease-in-out"
                                    textAnchor="middle"
                                    fill={selectedTable === '6'
                                        ? (dark ? '#0f172a' : '#ffffff')
                                        : (dark ? '#cbd5e1' : '#6b7280')
                                    }
                                >
                                    {isFarsi ? '۶' : '6'}
                                </text>
                                {/* 2 chairs face to face */}
                                <circle cx="475" cy="300" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="475" cy="360" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                            </g>

                            {/* Table 7 (large circle, salon right) - 4 chairs symmetric */}
                            <g
                                onClick={getClickHandler('7')}
                                className="cursor-pointer" // Removed transition from parent <g>
                            >
                                <circle
                                    cx="650"
                                    cy="330"
                                    r="55"
                                    className="transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '7'
                                        ? (dark ? '#facc15' : '#16a34a')
                                        : (dark ? '#64748b' : '#e5e7eb')
                                    }
                                    stroke={dark ? '#1e293b' : '#9ca3af'}
                                    strokeWidth="3"
                                />
                                <text
                                    x="650"
                                    y="342"
                                    className="text-3xl font-bold pointer-events-none transition-all duration-300 ease-in-out"
                                    textAnchor="middle"
                                    fill={selectedTable === '7'
                                        ? (dark ? '#0f172a' : '#ffffff')
                                        : (dark ? '#cbd5e1' : '#6b7280')
                                    }
                                >
                                    {isFarsi ? '۷' : '7'}
                                </text>
                                {/* Chair indicators - symmetric */}
                                <circle cx="606" cy="330" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="650" cy="286" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="694" cy="330" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="650" cy="374" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                            </g>

                            {/* Table 8 (large oval, salon bottom - center) - 6 chairs */}
                            <g
                                onClick={getClickHandler('8')}
                                className="cursor-pointer" // Removed transition from parent <g>
                            >
                                <ellipse
                                    cx="250"
                                    cy="465"
                                    rx="80"
                                    ry="45"
                                    className="transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '8'
                                        ? (dark ? '#facc15' : '#16a34a')
                                        : (dark ? '#64748b' : '#e5e7eb')
                                    }
                                    stroke={dark ? '#1e293b' : '#9ca3af'}
                                    strokeWidth="3"
                                />
                                <text
                                    x="250"
                                    y="475"
                                    className="text-3xl font-bold pointer-events-none transition-all duration-300 ease-in-out"
                                    textAnchor="middle"
                                    fill={selectedTable === '8'
                                        ? (dark ? '#0f172a' : '#ffffff')
                                        : (dark ? '#cbd5e1' : '#6b7280')
                                    }
                                >
                                    {isFarsi ? '۸' : '8'}
                                </text>
                                {/* 6 chairs */}
                                <circle cx="185" cy="445" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="215" cy="425" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="285" cy="425" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="315" cy="445" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="315" cy="485" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="185" cy="485" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                            </g>

                            {/* Table 9 (large oval, salon bottom - center-right) - 6 chairs */}
                            <g
                                onClick={getClickHandler('9')}
                                className="cursor-pointer" // Removed transition from parent <g>
                            >
                                <ellipse
                                    cx="450"
                                    cy="465"
                                    rx="80"
                                    ry="45"
                                    className="transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '9'
                                        ? (dark ? '#facc15' : '#16a34a')
                                        : (dark ? '#64748b' : '#e5e7eb')
                                    }
                                    stroke={dark ? '#1e293b' : '#9ca3af'}
                                    strokeWidth="3"
                                />
                                <text
                                    x="450"
                                    y="475"
                                    className="text-3xl font-bold pointer-events-none transition-all duration-300 ease-in-out"
                                    textAnchor="middle"
                                    fill={selectedTable === '9'
                                        ? (dark ? '#0f172a' : '#ffffff')
                                        : (dark ? '#cbd5e1' : '#6b7280')
                                    }
                                >
                                    {isFarsi ? '۹' : '9'}
                                </text>
                                {/* 6 chairs */}
                                <circle cx="385" cy="445" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="415" cy="425" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="485" cy="425" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="515" cy="445" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="515" cy="485" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="385" cy="485" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                            </g>

                            {/* Table 10 (large circle, salon bottom-right) - 4 chairs symmetric */}
                            <g
                                onClick={getClickHandler('10')}
                                className="cursor-pointer" // Removed transition from parent <g>
                            >
                                <circle
                                    cx="650"
                                    cy="465"
                                    r="55"
                                    className="transition-all duration-300 ease-in-out"
                                    fill={selectedTable === '10'
                                        ? (dark ? '#facc15' : '#16a34a')
                                        : (dark ? '#64748b' : '#e5e7eb')
                                    }
                                    stroke={dark ? '#1e293b' : '#9ca3af'}
                                    strokeWidth="3"
                                />
                                <text
                                    x="650"
                                    y="475"
                                    className="text-2xl font-bold pointer-events-none transition-all duration-300 ease-in-out"
                                    textAnchor="middle"
                                    fill={selectedTable === '10'
                                        ? (dark ? '#0f172a' : '#ffffff')
                                        : (dark ? '#cbd5e1' : '#6b7280')
                                    }
                                >
                                    {isFarsi ? '۱۰' : '10'}
                                </text>
                                {/* Chair indicators - symmetric */}
                                <circle cx="606" cy="465" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="650" cy="421" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="694" cy="465" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                                <circle cx="650" cy="509" r="8" fill={dark ? '#475569' : '#d1d5db'} />
                            </g>
                        </svg>
                    </div>)
                }

                {/* Legend */}
                <div className={`mt-3 text-xs ${dark ? 'text-slate-400' : 'text-gray-600'} text-center`}>
                    {t('cart.tap_table') || 'Tap on a table to select it'}
                </div>
            </div>
        </>
    )
}

export default RestaurantMap;