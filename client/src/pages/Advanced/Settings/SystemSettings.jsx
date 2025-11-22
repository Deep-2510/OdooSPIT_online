// pages/Advanced/Settings/SystemSettings.jsx
import { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  TextField,
  FormControlLabel,
  Switch,
  Button,
  Divider,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from '@mui/material';
import {
  Save,
  Restore,
  Notifications,
  Security,
  Storage,
} from '@mui/icons-material';
import { useApi } from '../../../hooks/useApi';
import { settingsAPI } from '../../../services/api/settings';

const SystemSettings = () => {
  const [settings, setSettings] = useState({
    // General Settings
    companyName: '',
    currency: 'USD',
    timezone: 'UTC',
    dateFormat: 'MM/DD/YYYY',
    
    // Notification Settings
    lowStockAlerts: true,
    outOfStockAlerts: true,
    emailNotifications: true,
    pushNotifications: false,
    
    // Security Settings
    sessionTimeout: 30,
    passwordPolicy: 'medium',
    twoFactorAuth: false,
    
    // Inventory Settings
    autoReorder: false,
    reorderBuffer: 10,
    stockUpdateDelay: 0,
    
    // System Settings
    backupFrequency: 'daily',
    retentionPeriod: 365,
    auditLogEnabled: true,
  });

  const [saved, setSaved] = useState(false);
  const { loading, execute } = useApi(() => settingsAPI.updateSettings(settings));

  const handleSave = async () => {
    try {
      await execute();
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    } catch (error) {
      console.error('Failed to save settings:', error);
    }
  };

  const handleReset = () => {
    // Reset to default settings
    setSettings({
      companyName: '',
      currency: 'USD',
      timezone: 'UTC',
      dateFormat: 'MM/DD/YYYY',
      lowStockAlerts: true,
      outOfStockAlerts: true,
      emailNotifications: true,
      pushNotifications: false,
      sessionTimeout: 30,
      passwordPolicy: 'medium',
      twoFactorAuth: false,
      autoReorder: false,
      reorderBuffer: 10,
      stockUpdateDelay: 0,
      backupFrequency: 'daily',
      retentionPeriod: 365,
      auditLogEnabled: true,
    });
  };

  const handleSettingChange = (key, value) => {
    setSettings(prev => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" component="h1">
          System Settings
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<Restore />}
            onClick={handleReset}
          >
            Reset to Defaults
          </Button>
          <Button
            variant="contained"
            startIcon={<Save />}
            onClick={handleSave}
            disabled={loading}
          >
            Save Settings
          </Button>
        </Box>
      </Box>

      {saved && (
        <Alert severity="success" sx={{ mb: 3 }}>
          Settings saved successfully!
        </Alert>
      )}

      <Grid container spacing={3}>
        {/* General Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Storage color="primary" />
                General Settings
              </Typography>
              
              <TextField
                fullWidth
                label="Company Name"
                value={settings.companyName}
                onChange={(e) => handleSettingChange('companyName', e.target.value)}
                sx={{ mb: 2 }}
              />

              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Currency</InputLabel>
                    <Select
                      value={settings.currency}
                      label="Currency"
                      onChange={(e) => handleSettingChange('currency', e.target.value)}
                    >
                      <MenuItem value="USD">USD</MenuItem>
                      <MenuItem value="EUR">EUR</MenuItem>
                      <MenuItem value="GBP">GBP</MenuItem>
                      <MenuItem value="JPY">JPY</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={6}>
                  <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Timezone</InputLabel>
                    <Select
                      value={settings.timezone}
                      label="Timezone"
                      onChange={(e) => handleSettingChange('timezone', e.target.value)}
                    >
                      <MenuItem value="UTC">UTC</MenuItem>
                      <MenuItem value="EST">EST</MenuItem>
                      <MenuItem value="PST">PST</MenuItem>
                      <MenuItem value="CET">CET</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Date Format</InputLabel>
                <Select
                  value={settings.dateFormat}
                  label="Date Format"
                  onChange={(e) => handleSettingChange('dateFormat', e.target.value)}
                >
                  <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                  <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                  <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                </Select>
              </FormControl>
            </CardContent>
          </Card>
        </Grid>

        {/* Notification Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Notifications color="primary" />
                Notification Settings
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.lowStockAlerts}
                    onChange={(e) => handleSettingChange('lowStockAlerts', e.target.checked)}
                  />
                }
                label="Low Stock Alerts"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.outOfStockAlerts}
                    onChange={(e) => handleSettingChange('outOfStockAlerts', e.target.checked)}
                  />
                }
                label="Out of Stock Alerts"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.emailNotifications}
                    onChange={(e) => handleSettingChange('emailNotifications', e.target.checked)}
                  />
                }
                label="Email Notifications"
                sx={{ mb: 1 }}
              />

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.pushNotifications}
                    onChange={(e) => handleSettingChange('pushNotifications', e.target.checked)}
                  />
                }
                label="Push Notifications"
                sx={{ mb: 1 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Security Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Security color="primary" />
                Security Settings
              </Typography>

              <TextField
                fullWidth
                type="number"
                label="Session Timeout (minutes)"
                value={settings.sessionTimeout}
                onChange={(e) => handleSettingChange('sessionTimeout', parseInt(e.target.value))}
                sx={{ mb: 2 }}
              />

              <FormControl fullWidth sx={{ mb: 2 }}>
                <InputLabel>Password Policy</InputLabel>
                <Select
                  value={settings.passwordPolicy}
                  label="Password Policy"
                  onChange={(e) => handleSettingChange('passwordPolicy', e.target.value)}
                >
                  <MenuItem value="low">Low</MenuItem>
                  <MenuItem value="medium">Medium</MenuItem>
                  <MenuItem value="high">High</MenuItem>
                </Select>
              </FormControl>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.twoFactorAuth}
                    onChange={(e) => handleSettingChange('twoFactorAuth', e.target.checked)}
                  />
                }
                label="Two-Factor Authentication"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Inventory Settings */}
        <Grid item xs={12} md={6}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Inventory Settings
              </Typography>

              <FormControlLabel
                control={
                  <Switch
                    checked={settings.autoReorder}
                    onChange={(e) => handleSettingChange('autoReorder', e.target.checked)}
                  />
                }
                label="Auto Reorder"
                sx={{ mb: 2 }}
              />

              <TextField
                fullWidth
                type="number"
                label="Reorder Buffer (%)"
                value={settings.reorderBuffer}
                onChange={(e) => handleSettingChange('reorderBuffer', parseInt(e.target.value))}
                sx={{ mb: 2 }}
                helperText="Additional buffer above reorder level"
              />

              <TextField
                fullWidth
                type="number"
                label="Stock Update Delay (seconds)"
                value={settings.stockUpdateDelay}
                onChange={(e) => handleSettingChange('stockUpdateDelay', parseInt(e.target.value))}
                helperText="Delay before updating stock levels"
              />
            </CardContent>
          </Card>
        </Grid>

        {/* System Settings */}
        <Grid item xs={12}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                System Settings
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={4}>
                  <FormControl fullWidth>
                    <InputLabel>Backup Frequency</InputLabel>
                    <Select
                      value={settings.backupFrequency}
                      label="Backup Frequency"
                      onChange={(e) => handleSettingChange('backupFrequency', e.target.value)}
                    >
                      <MenuItem value="daily">Daily</MenuItem>
                      <MenuItem value="weekly">Weekly</MenuItem>
                      <MenuItem value="monthly">Monthly</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={4}>
                  <TextField
                    fullWidth
                    type="number"
                    label="Retention Period (days)"
                    value={settings.retentionPeriod}
                    onChange={(e) => handleSettingChange('retentionPeriod', parseInt(e.target.value))}
                  />
                </Grid>

                <Grid item xs={12} md={4}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={settings.auditLogEnabled}
                        onChange={(e) => handleSettingChange('auditLogEnabled', e.target.checked)}
                      />
                    }
                    label="Audit Log Enabled"
                    sx={{ mt: 2 }}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SystemSettings;