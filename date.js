module.exports.getDate = getDate;

function getDate() {
  const today = new Date();

  const options = {
    month: "long",
    weekday: "long",
    day: "numeric",
  };

  const day = today.toLocaleDateString("en-US", options);
  return day;
}

module.exports.getDay = getDay;
function getDay() {
  const today = new Date();

  const options = {
    weekday: "long",
  };

  const day = today.toLocaleDateString("en-US", options);
  return day;
}

// console.log(module);
