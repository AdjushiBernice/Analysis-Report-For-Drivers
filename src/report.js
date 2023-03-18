const { getTrips, getDriver, getVehicle } = require("api");

/**
 * This function should return the data for drivers in the specified format
 *
 * Question 4
 *
 * @returns {any} Driver report data
 */
async function driverReport() {
  let newData = await getTrips();

  driversIdentity = [];
  for (let index of newData) {
    if (!driversIdentity.includes(index.driverID)) {
      driversIdentity.push(index.driverID);
    }
  }

  let resolvedDriverInfo = [];
  let driverInfo = [];
  for (let index of driversIdentity) {
    driverInfo.push(getDriver(index));
  }
  const fulfilledDriverInfo = await Promise.allSettled(driverInfo);
  for (let element of fulfilledDriverInfo) {
    if (element["status"] === "fulfilled") {
      resolvedDriverInfo.push(element);
    }
  }

  let tripInformation = {};
  for (let index of newData) {
    if (tripInformation[index.driverID]) {
      tripInformation[index.driverID]++;
    } else {
      tripInformation[index.driverID] = 1;
    }
  }
  let tripInformation2 = Object.values(tripInformation);

  let vehiclesID = [];
  for (let index of resolvedDriverInfo) {
    if (!vehiclesID.includes(index.value.vehicleID)) {
      vehiclesID.push(index.value.vehicleID);
    }
  }
  let resolvedVehicleInfo = [];
  let vehicleInfo = [];
  for (let index of vehiclesID) {
    vehicleInfo.push(getVehicle(index));
  }
  const fulfilledVehicleInfo = await Promise.allSettled(vehicleInfo);
  for (let element of fulfilledVehicleInfo) {
    if (element["status"] === "fulfilled") {
      resolvedVehicleInfo.push(element);
    }
  }

  let vehicle2;
  for (let index in resolvedVehicleInfo) {
    vehicle2 = {};
    vehicle2["plate"] = resolvedVehicleInfo[index].value.plate;
    vehicle2["manufacturer"] = resolvedVehicleInfo[index].value.manufacturer;
  }

  let cashtripInformation = {};
  let nonCashtripInformation = {};
  for (let index of newData) {
    if (index.isCash === true) {
      if (cashtripInformation[index.driverID]) {
        cashtripInformation[index.driverID]++;
      } else {
        cashtripInformation[index.driverID] = 1;
      }
    } else {
      if (nonCashtripInformation[index.driverID]) {
        nonCashtripInformation[index.driverID]++;
      } else {
        nonCashtripInformation[index.driverID] = 1;
      }
    }
  }
  let noOfCashTrips = Object.values(cashtripInformation);
  let noOfNonCashTrips = Object.values(nonCashtripInformation);

  let totalEarnInfo = {};
  for (let index of newData) {
    if (totalEarnInfo[index.driverID]) {
      totalEarnInfo[index.driverID] += parseInt(
        String(index["billedAmount"]).split(",").join("")
      );
    } else {
      totalEarnInfo[index.driverID] = parseInt(
        String(index["billedAmount"]).split(",").join("")
      );
    }
  }
  let totalAmountEarned = Object.values(totalEarnInfo);

  let totalCashAmt = {};
  let totalNonCashAmt = {};
  for (let index of newData) {
    if (index.isCash === true) {
      if (totalCashAmt[index.driverID]) {
        totalCashAmt[index.driverID] += parseInt(
          String(index["billedAmount"]).split(",").join("")
        );
      } else {
        totalCashAmt[index.driverID] = parseInt(
          String(index["billedAmount"]).split(",").join("")
        );
      }
    }
    if (index.isCash === false) {
      if (totalNonCashAmt[index.driverID]) {
        totalNonCashAmt[index.driverID] += parseInt(
          String(index["billedAmount"]).split(",").join("")
        );
      } else {
        totalNonCashAmt[index.driverID] = parseInt(
          String(index["billedAmount"]).split(",").join("")
        );
      }
    }
  }
  let totalCashAmount = Object.values(totalCashAmt);
  let totalNonCashAmount = Object.values(totalNonCashAmt);

  let usertrip;
  for (let elem in newData) {
    usertrip = {};
    usertrip["user"] = newData[elem].user.name;
    usertrip["created"] = newData[elem].created;
    usertrip["pickup"] = newData[elem].pickup;
    usertrip["destination"] = newData[elem].destination;
    usertrip["billed"] = newData[elem].billedAmount;
    usertrip["isCash"] = newData[elem].isCash;
  }

  let testArr = [];
  for (let elem in resolvedDriverInfo) {
    let driverDetails = {};
    if (resolvedDriverInfo[elem]) {
      driverDetails["fullName"] = resolvedDriverInfo[elem].value.name;
      driverDetails["id"] = driversIdentity[elem];
      driverDetails["phone"] = resolvedDriverInfo[elem].value.phone;
      driverDetails["noOfTrips"] = tripInformation2[elem];
      driverDetails["noOfVehicles"] =
        resolvedDriverInfo[elem].value.vehicleID.length;
      driverDetails["vehicle"] = [];
      driverDetails["vehicle"].push(vehicle2);
      driverDetails["noOfCashTrips"] = noOfCashTrips[elem];
      driverDetails["noOfNonCashTrips"] = noOfNonCashTrips[elem];
      driverDetails["totalAmountEarned"] = +totalAmountEarned[elem].toFixed(2);
      driverDetails["totalCashAmount"] = +totalCashAmount[elem];
      driverDetails["totalNonCashAmount"] =
        +totalNonCashAmount[elem].toFixed(2);
      driverDetails["trips"] = [];
      driverDetails["trips"].push(usertrip);
    }
    testArr.push(driverDetails);
  }
  return testArr;
}

module.exports = driverReport;
