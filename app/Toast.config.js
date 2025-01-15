import { View, Text, StyleSheet } from 'react-native';

const CustomToast = ({ text1, text2, ...props }) => (
    <View style={styles.toastContainer}>
      <Text style={styles.toastTitle}>{text1}</Text>
      {text2 ? <Text style={styles.toastMessage}>{text2}</Text> : null}
    </View>
);

const ToastConfig = {
  success: (props) => {
    if (typeof window === 'undefined') {
      return null; // Do not render on the server
    }
    return <CustomToast {...props} />;
  },
  error: (props) => {
    if (typeof window === 'undefined') {
      return null; // Do not render on the server
    }
    return <CustomToast {...props} />;
  },
  info: (props) => {
    if (typeof window === 'undefined') {
      return null; // Do not render on the server
    }
    return <CustomToast {...props} />;
  },
};

export default ToastConfig;

const styles = StyleSheet.create({
  toastContainer: {
    width: '90%',
    backgroundColor: '#333',
    padding: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FFF',
    alignSelf: 'center',
    marginTop: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
    elevation: 5,
  },
  toastTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#FFF',
    marginBottom: 5,
  },
  toastMessage: {
    fontSize: 14,
    color: '#EEE',
  },
});
