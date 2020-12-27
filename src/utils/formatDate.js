export const formatDate = date => {
  const time = new Date(date);
  const year = time.getFullYear();
  const month = time.getMonth() + 1;
  const day = time.getDate();
  const hour = time.getHours();
  const min = time.getMinutes();
  const seconds = time.getSeconds();
  return `${year}-${patch(month)}-${day}  ${patch(hour)}:${patch(min)}:${patch(
    seconds
  )}`;
};

function patch(data) {
  return (data = data < 10 ? "0" + data : data);
}
