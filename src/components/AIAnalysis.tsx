import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { 
  Brain, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle, 
  Eye,
  ArrowUp,
  XCircle,
  Clock
} from 'lucide-react';
import { AIAnalysis as AIAnalysisType } from '@/types/transaction';

interface AIAnalysisProps {
  analysis: AIAnalysisType;
  isLoading?: boolean;
}

export function AIAnalysis({ analysis, isLoading }: AIAnalysisProps) {
  const getActionIcon = (action: string) => {
    switch (action) {
      case 'Escalate':
        return <ArrowUp className="h-4 w-4 text-red-500" />;
      case 'Monitor':
        return <Eye className="h-4 w-4 text-blue-500" />;
      case 'Dismiss':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActionBadge = (action: string) => {
    switch (action) {
      case 'Escalate':
        return (
          <Badge variant="destructive\" className="flex items-center gap-1">
            <ArrowUp className="h-3 w-3" />
            Escalate
          </Badge>
        );
      case 'Monitor':
        return (
          <Badge variant="default" className="flex items-center gap-1 bg-blue-500">
            <Eye className="h-3 w-3" />
            Monitor
          </Badge>
        );
      case 'Dismiss':
        return (
          <Badge variant="secondary" className="flex items-center gap-1 bg-green-500 text-white">
            <CheckCircle className="h-3 w-3" />
            Dismiss
          </Badge>
        );
      default:
        return null;
    }
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'text-red-600';
    if (score >= 60) return 'text-orange-600';
    if (score >= 40) return 'text-yellow-600';
    return 'text-green-600';
  };

  const getRiskProgressColor = (score: number) => {
    if (score >= 80) return 'bg-red-500';
    if (score >= 60) return 'bg-orange-500';
    if (score >= 40) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Risk Analysis
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="h-4 bg-gray-200 rounded animate-pulse"></div>
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4"></div>
          </div>
          <div className="h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="space-y-2">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-3 bg-gray-100 rounded animate-pulse"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Brain className="h-5 w-5" />
            AI Risk Analysis
          </CardTitle>
          <div className="text-sm text-gray-500">
            Generated {formatDate(analysis.generatedAt)}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold mb-1">Risk Score</h3>
            <div className={`text-3xl font-bold ${getRiskColor(analysis.riskScore)}`}>
              {analysis.riskScore}/100
            </div>
          </div>
          <div className="text-right">
            <h3 className="font-semibold mb-1">Confidence</h3>
            <div className="text-2xl font-bold text-gray-700">
              {analysis.confidence}%
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Risk Level</span>
            <span className={getRiskColor(analysis.riskScore)}>
              {analysis.riskScore >= 80 ? 'Very High' : 
               analysis.riskScore >= 60 ? 'High' : 
               analysis.riskScore >= 40 ? 'Medium' : 'Low'}
            </span>
          </div>
          <div className="relative">
            <Progress value={analysis.riskScore} className="h-3" />
            <div 
              className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-300 ${getRiskProgressColor(analysis.riskScore)}`}
              style={{ width: `${analysis.riskScore}%` }}
            />
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Risk Assessment
          </h3>
          <p className="text-gray-700 leading-relaxed">{analysis.riskAssessment}</p>
        </div>

        <div>
          <h3 className="font-semibold mb-2">Recommended Action</h3>
          <div className="flex items-center gap-3">
            {getActionBadge(analysis.recommendedAction)}
            <span className="text-sm text-gray-600">
              Based on risk factors and transaction patterns
            </span>
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4" />
            Risk Factors
          </h3>
          <div className="space-y-2">
            {analysis.factors.map((factor, index) => (
              <div key={index} className="flex items-start gap-2 p-2 bg-gray-50 rounded">
                <div className="w-2 h-2 bg-orange-400 rounded-full mt-2 flex-shrink-0" />
                <span className="text-sm">{factor}</span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="font-semibold mb-2">AI Reasoning</h3>
          <p className="text-sm text-gray-600 leading-relaxed bg-gray-50 p-3 rounded">
            {analysis.reasoning}
          </p>
        </div>

        <div className="pt-4 border-t">
          <div className="flex gap-2">
            <Button
              size="sm"
              variant={analysis.recommendedAction === 'Escalate' ? 'destructive' : 'outline'}
              className="flex items-center gap-2"
            >
              <ArrowUp className="h-3 w-3" />
              Escalate
            </Button>
            <Button
              size="sm"
              variant={analysis.recommendedAction === 'Monitor' ? 'default' : 'outline'}
              className="flex items-center gap-2"
            >
              <Eye className="h-3 w-3" />
              Monitor
            </Button>
            <Button
              size="sm"
              variant={analysis.recommendedAction === 'Dismiss' ? 'secondary' : 'outline'}
              className="flex items-center gap-2"
            >
              <CheckCircle className="h-3 w-3" />
              Dismiss
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}