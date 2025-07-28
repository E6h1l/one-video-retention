const { useState, useEffect, useRef } = React;
const { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } = Recharts;

// Ваші дані (замість CSV файлу)
const audienceData = [
          {position: 0, retention: 99.5},
          {position: 1, retention: 89.34},
          {position: 2, retention: 82.27},
          {position: 3, retention: 76.36},
          {position: 4, retention: 72},
          {position: 5, retention: 69.02},
          {position: 6, retention: 67.46},
          {position: 7, retention: 64.86},
          {position: 8, retention: 63.48},
          {position: 9, retention: 63.03},
          {position: 10, retention: 61.91},
          {position: 11, retention: 59.73},
          {position: 12, retention: 58.15},
          {position: 13, retention: 57.12},
          {position: 14, retention: 55.04},
          {position: 15, retention: 54.02},
          {position: 16, retention: 52.95},
          {position: 17, retention: 51.24},
          {position: 18, retention: 47.9},
          {position: 19, retention: 45.89},
          {position: 20, retention: 44.29},
          {position: 21, retention: 43.51},
          {position: 22, retention: 42.74},
          {position: 23, retention: 42.22},
          {position: 24, retention: 41.67},
          {position: 25, retention: 40.42},
          {position: 26, retention: 39.65},
          {position: 27, retention: 38.98},
          {position: 28, retention: 38.03},
          {position: 29, retention: 36.79},
          {position: 30, retention: 35.76},
          {position: 31, retention: 35.22},
          {position: 32, retention: 34.82},
          {position: 33, retention: 34.66},
          {position: 34, retention: 34.08},
          {position: 35, retention: 33.69},
          {position: 36, retention: 33.33},
          {position: 37, retention: 33.59},
          {position: 38, retention: 33.73},
          {position: 39, retention: 31.87},
          {position: 40, retention: 31.58},
          {position: 41, retention: 31.48},
          {position: 42, retention: 31.21},
          {position: 43, retention: 31.11},
          {position: 44, retention: 30.9},
          {position: 45, retention: 30.51},
          {position: 46, retention: 30.2},
          {position: 47, retention: 30.18},
          {position: 48, retention: 30.1},
          {position: 49, retention: 30.09},
          {position: 50, retention: 29.87},
          {position: 51, retention: 29.47},
          {position: 52, retention: 29.07},
          {position: 53, retention: 28.94},
          {position: 54, retention: 28.77},
          {position: 55, retention: 28.57},
          {position: 56, retention: 28.44},
          {position: 57, retention: 28.25},
          {position: 58, retention: 28.06},
          {position: 59, retention: 28.03},
          {position: 60, retention: 27.98},
          {position: 61, retention: 27.82},
          {position: 62, retention: 27.65},
          {position: 63, retention: 27.38},
          {position: 64, retention: 27.2},
          {position: 65, retention: 26.97},
          {position: 66, retention: 26.95},
          {position: 67, retention: 26.74},
          {position: 68, retention: 26.56},
          {position: 69, retention: 28.33},
          {position: 70, retention: 25.83},
          {position: 71, retention: 25.58},
          {position: 72, retention: 25.53},
          {position: 73, retention: 25.38},
          {position: 74, retention: 25.35},
          {position: 75, retention: 25.16},
          {position: 76, retention: 24.97},
          {position: 77, retention: 24.61},
          {position: 78, retention: 24.33},
          {position: 79, retention: 24.14},
          {position: 80, retention: 24},
          {position: 81, retention: 23.93},
          {position: 82, retention: 23.84},
          {position: 83, retention: 23.77},
          {position: 84, retention: 23.69},
          {position: 85, retention: 23.61},
          {position: 86, retention: 23.55},
          {position: 87, retention: 23.39},
          {position: 88, retention: 23.46},
          {position: 89, retention: 23.43},
          {position: 90, retention: 23.57},
          {position: 91, retention: 23.53},
          {position: 92, retention: 23.68},
          {position: 93, retention: 23.62},
          {position: 94, retention: 23.65},
          {position: 95, retention: 23.11},
          {position: 96, retention: 22.68},
          {position: 97, retention: 21.79},
          {position: 98, retention: 20.99},
          {position: 99, retention: 20.87}
];

const AudienceRetentionChart = () => {
  const [currentTime, setCurrentTime] = useState(0);
  const [player, setPlayer] = useState(null);
  const [playerReady, setPlayerReady] = useState(false);

  const videoDurationSeconds = 9 * 60 + 40;
  const videoId = 'Tnp-XWElTMU';

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const percentToSeconds = (percent) => {
    return (percent / 100) * videoDurationSeconds;
  };

  const secondsToPercent = (seconds) => {
    return (seconds / videoDurationSeconds) * 100;
  };

  // Підготовка даних
  const data = audienceData.map(item => ({
    ...item,
    timeInSeconds: percentToSeconds(item.position),
    timeLabel: formatTime(percentToSeconds(item.position))
  }));

  // YouTube API
  useEffect(() => {
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      const ytPlayer = new window.YT.Player('youtube-player', {
        height: '315',
        width: '560',
        videoId: videoId,
        playerVars: {
          'playsinline': 1,
          'controls': 1,
          'rel': 0
        },
        events: {
          'onReady': (event) => {
            setPlayer(event.target);
            setPlayerReady(true);
          },
          'onStateChange': (event) => {
            if (event.data === window.YT.PlayerState.PLAYING) {
              const interval = setInterval(() => {
                if (event.target.getPlayerState() === window.YT.PlayerState.PLAYING) {
                  setCurrentTime(event.target.getCurrentTime());
                } else {
                  clearInterval(interval);
                }
              }, 100);
            }
          }
        }
      });
    };
  }, []);

  const handleChartClick = (event) => {
    if (event && event.activeLabel !== undefined && player && playerReady) {
      const position = event.activeLabel;
      const timeInSeconds = percentToSeconds(position);
      player.seekTo(timeInSeconds, true);
      setCurrentTime(timeInSeconds);
    }
  };

  const customTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      const timeLabel = formatTime(percentToSeconds(label));
      
      return React.createElement('div', {
        className: "bg-white p-3 border border-gray-300 rounded-lg shadow-lg"
      }, [
        React.createElement('p', {
          key: 'time',
          className: "font-semibold text-gray-800"
        }, `Час: ${timeLabel}`),
        React.createElement('p', {
          key: 'retention',
          className: "text-blue-600"
        }, `Збереження уваги: ${value.toFixed(2)}%`),
        React.createElement('p', {
          key: 'hint',
          className: "text-xs text-gray-500 mt-1"
        }, 'Клікніть, щоб перейти до цього моменту')
      ]);
    }
    return null;
  };

  const formatXAxisLabel = (value) => {
    return formatTime(percentToSeconds(value));
  };

  const formatYAxisLabel = (value) => {
    return `${value}%`;
  };

  const currentPosition = secondsToPercent(currentTime);

  return React.createElement('div', {
    className: "w-full max-w-7xl mx-auto p-6 bg-white"
  }, [
    // Заголовок
    React.createElement('div', {
      key: 'header',
      className: "mb-6"
    }, [
      React.createElement('h2', {
        key: 'title',
        className: "text-2xl font-bold text-gray-800 mb-2"
      }, 'Інтерактивний аналіз збереження уваги (9:40)'),
      React.createElement('p', {
        key: 'subtitle',
        className: "text-gray-600"
      }, 'Клікайте по графіку, щоб перейти до відповідного моменту відео')
    ]),
    
    // Основний контент
    React.createElement('div', {
      key: 'content',
      className: "grid grid-cols-1 lg:grid-cols-2 gap-6"
    }, [
      // YouTube відео
      React.createElement('div', {
        key: 'video',
        className: "bg-gray-50 p-4 rounded-lg"
      }, [
        React.createElement('h3', {
          key: 'video-title',
          className: "text-lg font-semibold mb-3 text-gray-800"
        }, 'Відео'),
        React.createElement('div', {
          key: 'video-container',
          className: "relative"
        }, [
          React.createElement('div', {
            key: 'player',
            id: "youtube-player",
            className: "w-full"
          }),
          !playerReady && React.createElement('div', {
            key: 'loading',
            className: "absolute inset-0 bg-gray-200 flex items-center justify-center rounded"
          }, React.createElement('div', {
            className: "text-gray-600"
          }, 'Завантаження YouTube відео...'))
        ]),
        React.createElement('div', {
          key: 'current-time',
          className: "mt-3 text-sm text-gray-600"
        }, [
          'Поточний час: ',
          React.createElement('span', {
            key: 'time',
            className: "font-mono"
          }, formatTime(currentTime))
        ])
      ]),

      // Статистика (спрощена версія)
      React.createElement('div', {
        key: 'stats',
        className: "bg-gray-50 p-4 rounded-lg"
      }, [
        React.createElement('h3', {
          key: 'stats-title',
          className: "text-lg font-semibold mb-3 text-gray-800"
        }, 'Ключові моменти'),
        React.createElement('div', {
          key: 'stats-content',
          className: "space-y-3"
        }, [
          React.createElement('div', {
            key: 'start',
            className: "bg-blue-50 p-3 rounded"
          }, [
            React.createElement('div', {
              key: 'start-title',
              className: "font-semibold text-blue-800"
            }, 'Початок (0:00-0:58)'),
            React.createElement('div', {
              key: 'start-value',
              className: "text-blue-700 text-sm"
            }, `Максимальна увага: ${data[0]?.retention.toFixed(1)}%`)
          ]),
          React.createElement('div', {
            key: 'end',
            className: "bg-red-50 p-3 rounded"
          }, [
            React.createElement('div', {
              key: 'end-title',
              className: "font-semibold text-red-800"
            }, 'Кінець (8:42-9:40)'),
            React.createElement('div', {
              key: 'end-value',
              className: "text-red-700 text-sm"
            }, `Мінімальна увага: ${data[data.length - 1]?.retention.toFixed(1)}%`)
          ])
        ])
      ])
    ]),
    
    // Графік
    React.createElement('div', {
      key: 'chart',
      className: "mt-6 bg-gray-50 p-4 rounded-lg"
    }, [
      React.createElement('h3', {
        key: 'chart-title',
        className: "text-lg font-semibold mb-3 text-gray-800"
      }, 'Графік збереження уваги'),
      React.createElement(ResponsiveContainer, {
        key: 'chart-container',
        width: "100%",
        height: 400
      }, React.createElement(LineChart, {
        data: data,
        margin: {
          top: 20,
          right: 30,
          left: 60,
          bottom: 60,
        },
        onClick: handleChartClick
      }, [
        React.createElement(CartesianGrid, {
          key: 'grid',
          strokeDasharray: "3 3",
          stroke: "#e0e0e0"
        }),
        React.createElement(XAxis, {
          key: 'xaxis',
          dataKey: "position",
          type: "number",
          scale: "linear",
          domain: [0, 100],
          ticks: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
          tickFormatter: formatXAxisLabel,
          axisLine: { stroke: '#666', strokeWidth: 1 },
          tickLine: { stroke: '#666', strokeWidth: 1 },
          tick: { fontSize: 12, fill: '#666' }
        }),
        React.createElement(YAxis, {
          key: 'yaxis',
          type: "number",
          domain: [15, 105],
          ticks: [20, 30, 40, 50, 60, 70, 80, 90, 100],
          tickFormatter: formatYAxisLabel,
          axisLine: { stroke: '#666', strokeWidth: 1 },
          tickLine: { stroke: '#666', strokeWidth: 1 },
          tick: { fontSize: 12, fill: '#666' }
        }),
        React.createElement(Tooltip, {
          key: 'tooltip',
          content: customTooltip
        }),
        currentTime > 0 && React.createElement(ReferenceLine, {
          key: 'current-line',
          x: currentPosition,
          stroke: "#ff4444",
          strokeWidth: 2,
          strokeDasharray: "5 5"
        }),
        React.createElement(Line, {
          key: 'line',
          type: "monotone",
          dataKey: "retention",
          stroke: "#2563eb",
          strokeWidth: 3,
          dot: { r: 0 },
          activeDot: {
            r: 6,
            fill: '#1d4ed8',
            stroke: '#ffffff',
            strokeWidth: 2
          }
        })
      ]))
    ]),
    
    React.createElement('div', {
      key: 'hint',
      className: "mt-4 text-xs text-gray-500 text-center"
    }, '💡 Клікніть на будь-яку точку графіка, щоб перейти до відповідного моменту у відео')
  ]);
};

ReactDOM.render(React.createElement(AudienceRetentionChart), document.getElementById('root'));
