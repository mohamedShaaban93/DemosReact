import Snackbar from 'react-native-snackbar';
import I18n from 'react-native-i18n';

import { getTheme } from '../Theme';
import { getThemeColor } from './colors';

export const showInfo = message => {
  Snackbar.show({
    title: message,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: getThemeColor(
      getTheme().localNotifications.info.backgroundColor,
    ),
    action: {
      title: I18n.t('ui-close'),
      color: getThemeColor(getTheme().localNotifications.info.closeColor),
    },
  });
};

export const showSuccess = message => {
  Snackbar.show({
    title: message,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: getThemeColor(
      getTheme().localNotifications.success.backgroundColor,
    ),
    action: {
      title: I18n.t('ui-close'),
      color: getThemeColor(getTheme().localNotifications.success.closeColor),
    },
  });
};

export const showError = message => {
  Snackbar.show({
    title: message,
    duration: Snackbar.LENGTH_LONG,
    backgroundColor: getThemeColor(
      getTheme().localNotifications.error.backgroundColor,
    ),
    action: {
      title: I18n.t('ui-close'),
      color: getThemeColor(getTheme().localNotifications.error.closeColor),
    },
  });
};
