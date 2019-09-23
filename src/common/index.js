import './Base/polyfill';

export { default as AppView } from './View';
export { default as AppScrollView } from './ScrollView';
export { default as AppText } from './Text';
export { default as AppIcon } from './Icon';
export { default as AppSpinner } from './Indicator';
export { default as AppButton } from './Button';
export { default as AppImage } from './Image';
export { default as AppList } from './List';
export { default as AppTabs } from './Tabs';
export { default as AppInput } from './Input';
export { default as AppCheckbox } from './CheckBox'
export { default as AppTextArea } from './TextArea';
export { default as AppPicker } from './Picker';
export { default as AppDatePicker } from './DatePicker';
export { default as AppWheelPicker } from './WheelPicker';
export { default as AppRadioGroup } from './RadioGroup';
export { default as AppRadioButton } from './RadioButton';
export { default as CheckBoxGroup } from './CheckBoxGroup';
export { default as CheckBox } from './CheckBox';
export { default as SelectionOptionsGroup } from './SelectionOptionsGroup';
export { default as AppDropDown } from './DropDown';
export { default as AppModal } from './Modal';
export { default as AppNavigation } from './Navigation';
export { default as AppcreateStackNavigation } from './StackNavigation';
export { default as AppAnimatedText } from './AppAnimatedText';
export { default as AppInputError } from './micro/InputError';
export { registerCustomIconType } from './utils/icon';
export { getColors, getColor, getTheme, getFonts } from './Theme';
export { showInfo, showSuccess, showError } from './utils/localNotifications';

export {
  responsiveHeight,
  responsiveWidth,
  responsiveFontSize,
  moderateScale,
  windowWidth,
  windowHeight,
  screenWidth,
  screenHeight,
  heightPercent
} from './utils/responsiveDimensions';

export { default as LocaleEn } from './defaults/en.json';
export { default as LocaleAr } from './defaults/ar.json';

export { default as AppSwitch } from './appSwitch/AppSwitch';
export { default as AppSlider } from './AppSlider';
export { default as AppStarRating } from './AppStarRating';
export { default as AppFormLocation } from './FormLocation';
export { default as AppOtpInput } from './otpInput/OtpInput';
export { default as ListTile } from './ListTile';
