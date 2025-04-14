
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  BarChart,
  Bar,
  PieChart, 
  Pie, 
  Cell,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend,
  ScatterChart,
  Scatter,
  ZAxis
} from 'recharts';

interface RetinaAnalysisProps {
  patterns: number[];
  signaturePoints: {x: number, y: number, intensity: number}[];
  matchScore?: number;
  isMatching: boolean;
}

const RetinaAnalysis: React.FC<RetinaAnalysisProps> = ({ 
  patterns, 
  signaturePoints, 
  matchScore, 
  isMatching 
}) => {
  const barData = patterns.map((value, index) => ({
    name: `P${index + 1}`,
    value
  }));

  const lineData = barData.map((item, index) => ({
    ...item,
    trend: (index > 0) ? 
      Math.floor(barData[index-1].value + Math.random() * 20 - 10) : 
      Math.floor(item.value * 0.8)
  }));

  const pieData = [
    { name: 'Vessel Density', value: Math.floor(Math.random() * 30 + 60) },
    { name: 'Pigmentation', value: Math.floor(Math.random() * 20 + 20) },
    { name: 'Other', value: Math.floor(Math.random() * 10 + 5) }
  ];

  const COLORS = ['#1EAEDB', '#0FA0CE', '#403E43'];

  const scatterData = signaturePoints.map(point => ({
    x: point.x * 100,
    y: point.y * 100,
    z: point.intensity * 10
  }));

  return (
    <Card className="retina-card">
      <CardContent className="p-6">
        <h2 className="text-xl font-semibold text-retina-blue mb-4">
          {isMatching ? "Retina Analysis Comparison" : "Retina Analysis"}
        </h2>


        {isMatching && matchScore !== undefined && (
          <div className="mb-6">
            <div className="flex justify-between mb-2">
              <span className="text-sm">Match Score</span>
              <span className="text-sm font-medium">{Math.round(matchScore)}%</span>
            </div>
            <Progress 
              value={matchScore} 
              className="h-2"
              indicatorClassName={
                matchScore > 85 ? "bg-green-500" : 
                matchScore > 70 ? "bg-yellow-500" : 
                "bg-red-500"
              }
            />
            <div className="mt-2 text-center">
              {matchScore > 85 ? (
                <span className="text-green-500 font-medium">Strong Match</span>
              ) : matchScore > 70 ? (
                <span className="text-yellow-500 font-medium">Partial Match</span>
              ) : (
                <span className="text-red-500 font-medium">No Match</span>
              )}
            </div>
          </div>
        )}

        <Tabs defaultValue="patterns">
          <TabsList className="grid grid-cols-3">
            <TabsTrigger value="patterns">Patterns</TabsTrigger>
            <TabsTrigger value="points">Points</TabsTrigger>
            <TabsTrigger value="composition">Composition</TabsTrigger>
          </TabsList>

          <TabsContent value="patterns" className="space-y-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={lineData}
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis dataKey="name" tick={{ fill: '#ccc' }} />
                  <YAxis tick={{ fill: '#ccc' }} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1F2C', 
                      border: '1px solid #1EAEDB',
                      borderRadius: '4px'
                    }} 
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#1EAEDB"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="trend" 
                    stroke="#0FA0CE" 
                    strokeDasharray="5 5"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="points" className="space-y-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart
                  margin={{ top: 10, right: 10, left: 0, bottom: 20 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                  <XAxis 
                    type="number" 
                    dataKey="x" 
                    name="X-Position" 
                    unit="%" 
                    tick={{ fill: '#ccc' }}
                    domain={[0, 100]}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="y" 
                    name="Y-Position" 
                    unit="%" 
                    tick={{ fill: '#ccc' }} 
                    domain={[0, 100]}
                  />
                  <ZAxis
                    type="number"
                    dataKey="z"
                    range={[20, 100]}
                    name="Intensity"
                  />
                  <Tooltip 
                    cursor={{ strokeDasharray: '3 3' }}
                    contentStyle={{ 
                      backgroundColor: '#1A1F2C', 
                      border: '1px solid #1EAEDB',
                      borderRadius: '4px'
                    }}
                    formatter={(value: any) => [value, '']}
                  />
                  <Scatter 
                    name="Signature Points" 
                    data={scatterData} 
                    fill="#1EAEDB"
                  />
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>

          <TabsContent value="composition" className="space-y-4">
            <div className="h-72">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#1A1F2C', 
                      border: '1px solid #1EAEDB',
                      borderRadius: '4px'
                    }} 
                  />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </TabsContent>
        </Tabs>

        <div className="mt-4 bg-secondary/50 rounded-md p-3">
          <h3 className="text-sm font-medium mb-2">Analysis Details</h3>
          <ul className="text-xs text-muted-foreground space-y-1">
            <li>• Vessel Pattern Recognition: {Math.floor(Math.random() * 10 + 90)}% confidence</li>
            <li>• Signature Points Identified: {signaturePoints.length}</li>
            <li>• Pattern Distribution: Normalized</li>
            <li>• Scan Quality: High</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default RetinaAnalysis;
