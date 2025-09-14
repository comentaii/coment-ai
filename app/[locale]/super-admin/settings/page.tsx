'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui/button';
import { Save } from 'lucide-react';

export default function PlatformSettingsPage() {
  const t = useTranslations('super-admin.settings');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">{t('title')}</h1>
        <p className="text-muted-foreground">{t('description')}</p>
      </div>

      <Tabs defaultValue="general" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">{t('tabs.general.title')}</TabsTrigger>
          <TabsTrigger value="ai">{t('tabs.ai.title')}</TabsTrigger>
          <TabsTrigger value="plans">{t('tabs.plans.title')}</TabsTrigger>
          <TabsTrigger value="integrations">{t('tabs.integrations.title')}</TabsTrigger>
        </TabsList>
        
        {/* General Settings Tab */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle>{t('tabs.general.title')}</CardTitle>
              <CardDescription>{t('tabs.general.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="appName">{t('tabs.general.appNameLabel')}</Label>
                <Input id="appName" placeholder={t('tabs.general.appNamePlaceholder')} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="logo">{t('tabs.general.logoLabel')}</Label>
                <Input id="logo" type="file" />
              </div>
               <Button className="mt-4">
                <Save className="mr-2 h-4 w-4" />
                {t('saveButton')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Settings Tab */}
        <TabsContent value="ai">
          <Card>
            <CardHeader>
              <CardTitle>{t('tabs.ai.title')}</CardTitle>
              <CardDescription>{t('tabs.ai.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="geminiApiKey">{t('tabs.ai.geminiApiKeyLabel')}</Label>
                <Input id="geminiApiKey" type="password" placeholder="••••••••••••••••" />
              </div>
               <Button className="mt-4">
                <Save className="mr-2 h-4 w-4" />
                {t('saveButton')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Subscription Plans Tab */}
        <TabsContent value="plans">
          <Card>
            <CardHeader>
              <CardTitle>{t('tabs.plans.title')}</CardTitle>
              <CardDescription>{t('tabs.plans.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Basic Plan */}
              <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">{t('tabs.plans.basic.title')}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="basicCv">{t('tabs.plans.cvUploads')}</Label>
                    <Input id="basicCv" type="number" defaultValue="100" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="basicInterviews">{t('tabs.plans.interviews')}</Label>
                    <Input id="basicInterviews" type="number" defaultValue="50" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="basicStorage">{t('tabs.plans.storage')}</Label>
                    <Input id="basicStorage" type="number" defaultValue="10" />
                  </div>
                </div>
              </div>
              {/* Premium Plan */}
               <div className="space-y-4 p-4 border rounded-lg">
                <h3 className="font-semibold">{t('tabs.plans.premium.title')}</h3>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="premiumCv">{t('tabs.plans.cvUploads')}</Label>
                    <Input id="premiumCv" type="number" defaultValue="500" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="premiumInterviews">{t('tabs.plans.interviews')}</Label>
                    <Input id="premiumInterviews" type="number" defaultValue="250" />
                  </div>
                   <div className="space-y-2">
                    <Label htmlFor="premiumStorage">{t('tabs.plans.storage')}</Label>
                    <Input id="premiumStorage" type="number" defaultValue="50" />
                  </div>
                </div>
              </div>
               <Button className="mt-4">
                <Save className="mr-2 h-4 w-4" />
                {t('saveButton')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

         {/* Integrations Tab */}
        <TabsContent value="integrations">
          <Card>
            <CardHeader>
              <CardTitle>{t('tabs.integrations.title')}</CardTitle>
              <CardDescription>{t('tabs.integrations.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="resendApiKey">{t('tabs.integrations.resendLabel')}</Label>
                <Input id="resendApiKey" type="password" placeholder="re_••••••••••••••••" />
              </div>
               <Button className="mt-4">
                <Save className="mr-2 h-4 w-4" />
                {t('saveButton')}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
