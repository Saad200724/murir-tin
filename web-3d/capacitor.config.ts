import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.murirtin.dhakabus3d',
  appName: 'Murir Tin 3D',
  webDir: '../build/webgl',
  bundledWebRuntime: false,
  android: {
    backgroundColor: '#1b1f2a',
    allowMixedContent: false,
  },
};

export default config;
