
(async () => {
  let args = getArgs();
  let info = await getDataInfo(args.url);
  
  if (!info) return $done();

  let resetDayLeft = getRemainingDays(parseInt(args["reset_day"]));
  let planDate = getPlanDate(parseInt(args["reset_day"]));
  let expireDaysLeft = getExpireDaysLeft(info.expire);

  let used = info.download + info.upload;
  let total = info.total;
  let content = [`Usage: ${bytesToSize(used)} / ${bytesToSize(total)}`];

  if (!resetDayLeft && !expireDaysLeft) {
    let percentage = ((used / total) * 100).toFixed(1);
    content.push(`${percentage}% of the traffice has been used.`);
  } else {if (resetDayLeft) {
      content.push(`Reset in ${planDate}, ${resetDayLeft} days left.`);
    } 
    
    if (expireDaysLeft) {
      content.push(`Expire in ${formatTime(info.expire)}, ${expireDaysLeft} days left.`);
    }
  }

  $done({
    title: `${args.title}`,
    content: content.join("\n"),
    icon: args.icon || "network.badge.shield.half.filled",
    "icon-color": args.color || "#649ff8",
  });
})();

function getArgs() {
  return Object.fromEntries(
    $argument
      .split("&")
      .map((item) => item.split("="))
      .map(([k, v]) => [k, decodeURIComponent(v)])
  );
}

function getUserInfo(url) {
  let request = { headers: { "User-Agent": "Surge" }, url };
  return new Promise((resolve, reject) =>
    $httpClient.get(request, (err, resp) => {
      if (err != null) {
        reject(err);
        return;
      }
      if (resp.status !== 200) {
        reject(resp.status);
        return;
      }
      let header = Object.keys(resp.headers).find((key) => key.toLowerCase() === "subscription-userinfo");
      if (header) {
        resolve(resp.headers[header]);
        return;
      }
      reject("The link’s response headers do not contain traffic information.");
    })
  );
}

async function getDataInfo(url) {
  const [err, data] = await getUserInfo(url)
    .then((data) => [null, data])
    .catch((err) => [err, null]);
  if (err) {
    console.log(err);
    return;
  }

  return Object.fromEntries(
    data
      .match(/\w+=[\d.eE+-]+/g)
      .map((item) => item.split("="))
      .map(([k, v]) => [k, Number(v)])
  );
}

function getRemainingDays(resetDay) {
  if (!resetDay || resetDay < 1 || resetDay > 31) return;

  let now = new Date();
  let today = now.getDate();
  let month = now.getMonth();
  let year = now.getFullYear();

  let daysInThisMonth = new Date(year, month + 1, 0).getDate();
  let daysInNextMonth = new Date(year, month + 2, 0).getDate();

  resetDay = Math.min(resetDay, daysInThisMonth);

  if (resetDay > today) {
    return resetDay - today;
  } else {
    resetDay = Math.min(resetDay, daysInNextMonth);
    return daysInThisMonth - today + resetDay;
  }
}

function getPlanDate(resetDay) {
  if (!resetDay || resetDay < 1 || resetDay > 31) return;

  let now = new Date();
  let today = now.getDate();
  let month = now.getMonth()+1;
  let year = now.getFullYear();
  let nextmonth = now.getMonth()+2;
  let daysInThisMonth = new Date(year, month, 0).getDate();
  let daysInNextMonth = new Date(year, nextmonth, 0).getDate();
  if (Math.min(resetDay, daysInThisMonth) > today) {
    return `${year}/${String(month).padStart(2, '0')}/${String(Math.min(resetDay, daysInThisMonth)).padStart(2, '0')}`;
  } else {
    if (nextmonth > 12) {
      year += 1; 
      nextmonth = 1;
    }
    return `${year}/${String(nextmonth).padStart(2, '0')}/${String(Math.min(resetDay, daysInNextMonth)).padStart(2, '0')}`;
  }
}


function getExpireDaysLeft(expire) {
  if (!expire) return;

  let now = new Date().getTime();
  let expireTime;
  if (/^[\d.]+$/.test(expire)) {
    expireTime = parseInt(expire) * 1000;
  } else {
    expireTime = new Date(expire).getTime();
  }

  let daysLeft = Math.ceil((expireTime - now) / (1000 * 60 * 60 * 24));
  return daysLeft > 0 ? daysLeft : null;
}

function bytesToSize(bytes) {
  if (bytes === 0) return "0B";
  let k = 1024;
  let sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  let i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
}

function formatTime(time) {
  if (time < 1000000000000) time *= 1000;

  let dateObj = new Date(time);
  let year = dateObj.getFullYear();
  let month = dateObj.getMonth() + 1;
  let day = dateObj.getDate();
  return `${year}/${String(month).padStart(2, '0')}/${String(day).padStart(2, '0')}`;
}

