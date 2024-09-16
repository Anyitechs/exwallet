import * as SecureStore from 'expo-secure-store';

export const saveItem = async (key: string, value: string) => {
  if (await SecureStore.getItemAsync(key)) {
    await SecureStore.deleteItemAsync(key);
  }
  await SecureStore.setItemAsync(key, value);
}

export const getItem = async (key: string) => {
  let result = await SecureStore.getItemAsync(key);
  if (result) {
    console.log("🔐 Here's your value 🔐 \n" + result);
    return result;
  }
  return null
}