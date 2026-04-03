 export const getStatusTheme = (status: string, isDarkMode: boolean) => {
  const s = status.toLowerCase();
  switch (s) {
    case 'new':
      return {
        bg: isDarkMode ? 'rgba(46, 204, 113, 0.15)' : '#E8F8F0',
        text: '#2ecc71',
        icon: 'flash-outline'
      };
    case 'preparing':
      return {
        bg: isDarkMode ? 'rgba(168, 230, 207, 0.15)' : 'rgba(32, 58, 67, 0.1)',
        text: isDarkMode ? '#A8E6CF' : '#203A43',
        icon: 'restaurant-outline'
      };
    case 'shipped':
      return {
        bg: isDarkMode ? 'rgba(52, 152, 219, 0.15)' : '#EBF5FB',
        text: '#3498db',
        icon: 'bicycle-outline'
      };
    case 'delivered':
      return {
        bg: isDarkMode ? 'rgba(46, 204, 113, 0.2)' : '#D4EFDF',
        text: '#1B5E20',
        icon: 'checkmark-circle-outline'
      };
    case 'cancelled':
      return {
        bg: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : '#F2F2F2',
        text: '#8E8E93',
        icon: 'close-circle-outline'
      };
    default:
      return {
        bg: 'rgba(128,128,128,0.1)',
        text: '#8E8E93',
        icon: 'help-circle-outline'
      };
  }
};