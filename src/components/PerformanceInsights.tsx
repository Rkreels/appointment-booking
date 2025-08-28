import React from 'react';
import { useUserTracking } from '../hooks/useUserTracking';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

export const PerformanceInsights: React.FC = () => {
  const { analytics, currentSession } = useUserTracking();

  const getSkillLevelColor = (level: string) => {
    switch (level) {
      case 'Expert': return 'bg-green-500';
      case 'Advanced': return 'bg-blue-500';
      case 'Intermediate': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const formatTime = (ms: number) => {
    const hours = Math.floor(ms / (1000 * 60 * 60));
    const minutes = Math.floor((ms % (1000 * 60 * 60)) / (1000 * 60));
    return `${hours}h ${minutes}m`;
  };

  return (
    <div className="space-y-4 max-w-2xl mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            Learning Progress
            <Badge className={getSkillLevelColor(analytics.skillLevel)}>
              {analytics.skillLevel}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">Total Sessions</p>
              <p className="text-2xl font-bold">{analytics.totalSessions}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Time Spent</p>
              <p className="text-2xl font-bold">{formatTime(analytics.totalTimeSpent)}</p>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Overall Efficiency</span>
              <span>{Math.round(analytics.overallEfficiency)}%</span>
            </div>
            <Progress value={analytics.overallEfficiency} className="h-2" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Skill Areas</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {Object.entries(analytics.completionRates).map(([skill, rate]) => (
            <div key={skill}>
              <div className="flex justify-between text-sm mb-1">
                <span className="capitalize">{skill.replace(/([A-Z])/g, ' $1').trim()}</span>
                <span>{Math.round(rate)}%</span>
              </div>
              <Progress value={rate} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>

      {analytics.improvementAreas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Areas for Improvement</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {analytics.improvementAreas.map((area, index) => (
                <Badge key={index} variant="outline">
                  {area}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {currentSession && (
        <Card>
          <CardHeader>
            <CardTitle>Current Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Actions</p>
                <p className="text-lg font-semibold">{currentSession.totalActions}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Accuracy</p>
                <p className="text-lg font-semibold">
                  {currentSession.totalActions > 0 
                    ? Math.round((currentSession.correctActions / currentSession.totalActions) * 100)
                    : 0}%
                </p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Tasks Completed</p>
              <div className="flex flex-wrap gap-1 mt-1">
                {currentSession.completedTasks.map((task, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {task.replace(/-/g, ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};