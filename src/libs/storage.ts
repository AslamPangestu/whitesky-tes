import dayjs from "dayjs";

class LocalStorage {
  private key: string;

  constructor(key: string) {
    this.key = key;
  }
  get = () => {
    const storage = localStorage.getItem(this.key);
    if (!storage) {
      return null;
    }

    const parseStorage = JSON.parse(storage);
    const currentDate = dayjs();
    if (currentDate.diff(parseStorage.timestamp, "hour") > 24) {
      localStorage.removeItem(this.key);
      return null;
    }

    return parseStorage.value;
  };
  set = (value: any) => {
    const payload = JSON.stringify({ value, timestamp: dayjs().toString() });
    localStorage.setItem(this.key, payload);
  };
  remove = () => {
    localStorage.removeItem(this.key);
  };
}

export default LocalStorage;
