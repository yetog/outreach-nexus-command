
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Mail, Eye, MousePointer, UserMinus, TrendingUp, Calendar } from 'lucide-react';

interface EmailLog {
  id: string;
  campaignName: string;
  recipientEmail: string;
  recipientName: string;
  status: 'sent' | 'delivered' | 'opened' | 'clicked' | 'bounced' | 'unsubscribed';
  sentAt: string;
  openedAt?: string;
  clickedAt?: string;
}

export const StatusTracker = () => {
  const emailLogs: EmailLog[] = [
    // Sample data - in real app this would come from your backend
  ];

  const stats = {
    totalSent: 0,
    delivered: 0,
    opened: 0,
    clicked: 0,
    bounced: 0,
    unsubscribed: 0,
    openRate: 0,
    clickRate: 0
  };

  const getStatusColor = (status: EmailLog['status']) => {
    switch (status) {
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'opened': return 'bg-purple-100 text-purple-800';
      case 'clicked': return 'bg-orange-100 text-orange-800';
      case 'bounced': return 'bg-red-100 text-red-800';
      case 'unsubscribed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Analytics Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Mail className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{stats.totalSent}</p>
                <p className="text-sm text-gray-600">Total Sent</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Eye className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{stats.openRate}%</p>
                <p className="text-sm text-gray-600">Open Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <MousePointer className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{stats.clickRate}%</p>
                <p className="text-sm text-gray-600">Click Rate</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <UserMinus className="h-8 w-8 text-red-500" />
              <div>
                <p className="text-2xl font-bold">{stats.bounced}</p>
                <p className="text-sm text-gray-600">Bounced</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Email Activity Log */}
      <Card>
        <CardHeader>
          <CardTitle>Email Activity Log</CardTitle>
          <CardDescription>
            Track email delivery, opens, clicks, and other engagement metrics
          </CardDescription>
        </CardHeader>
        <CardContent>
          {emailLogs.length === 0 ? (
            <div className="text-center text-gray-500 py-12">
              <TrendingUp className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No email activity yet</p>
              <p className="text-sm">Email logs and analytics will appear here once you start sending campaigns</p>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-4 p-4 bg-gray-50 font-medium text-sm border-b rounded-t-lg">
                <div>Recipient</div>
                <div>Campaign</div>
                <div>Status</div>
                <div>Sent At</div>
                <div>Opened At</div>
                <div>Actions</div>
              </div>
              
              {emailLogs.map((log) => (
                <div key={log.id} className="grid grid-cols-6 gap-4 p-4 border-b hover:bg-gray-50">
                  <div>
                    <div className="font-medium">{log.recipientName}</div>
                    <div className="text-sm text-gray-500">{log.recipientEmail}</div>
                  </div>
                  <div className="text-sm">{log.campaignName}</div>
                  <div>
                    <Badge className={getStatusColor(log.status)}>
                      {log.status}
                    </Badge>
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(log.sentAt).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-600">
                    {log.openedAt ? new Date(log.openedAt).toLocaleString() : '-'}
                  </div>
                  <div>
                    <button className="text-blue-600 hover:text-blue-800 text-sm">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Campaign Performance Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Campaign Performance</CardTitle>
          <CardDescription>
            Overview of your campaign metrics and engagement rates
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center text-gray-500 py-8">
            <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
            <p className="text-lg font-medium">Performance charts coming soon</p>
            <p className="text-sm">Detailed analytics and charts will be displayed here</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
