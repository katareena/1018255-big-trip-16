import dayjs from 'dayjs';
export const formatPointDate = (date, format) => dayjs(date).format(format);
