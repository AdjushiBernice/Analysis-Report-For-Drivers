const { getTrips, getDriver } = require("api");

/**
 * This function should return the trip data analysis
 *
 * Question 3
 * @returns {any} Trip data analysis
 */
async function analysis() {
  // Your code goes here
  let isCash = 0;
  let totalIsCash = 0;
  let totalBilledAmount = 0;
  let nonCash = 0;
  let totalIsNonCash = 0;
  let output;

  const trips = await getTrips();

  for (let element of trips) {
    if (element["isCash"] === true) {
      isCash++;
      totalIsCash += parseFloat(
        String(element["billedAmount"]).split(",").join("")
      );
    } else if (element["isCash"] === false) {
      nonCash++;
      totalIsNonCash += parseFloat(
        String(element["billedAmount"]).split(",").join("")
      );
    }
    totalBilledAmount += parseFloat(
      String(element["billedAmount"]).split(",").join("")
    );
  }

  driversIdentity = [];
  for (let index of trips) {
    if (!driversIdentity.includes(index.driverID)) {
      driversIdentity.push(index.driverID);
    }
  }
  let driverInformation = [];
  for (let index of driversIdentity) {
    driverInformation.push(getDriver(index));
  }

  let resolvedDriverInformation = [];
  let noOfDriversWithMoreOneVehicle = 0;

  const fulfilledDriverInformation = await Promise.allSettled(
    driverInformation
  );
  for (let element of fulfilledDriverInformation) {
    if (element["status"] === "fulfilled") {
      resolvedDriverInformation.push(element);
    }
  }
  for (let element in resolvedDriverInformation) {
    if (resolvedDriverInformation[element].value.vehicleID.length > 1) {
      noOfDriversWithMoreOneVehicle++;
    }
  }

  let tripInformation = {};
  for (let index of trips) {
    if (tripInformation[index.driverID]) {
      tripInformation[index.driverID]++;
    } else {
      tripInformation[index.driverID] = 1;
    }
  }
  let newValues = Object.values(tripInformation);
  let maxTripValues = Math.max(...newValues);
  let indexMaxTripsByDriver = newValues.indexOf(maxTripValues);


  let earnInformation = {};
  for (let index of trips) {
    if (earnInformation[index.driverID]) {
      earnInformation[index.driverID] += Number(
        String(index["billedAmount"]).split(",").join("")
      );
    } else {
      earnInformation[index.driverID] = Number(
        String(index["billedAmount"]).split(",").join("")
      );
    }
  }
  let newValues2 = Object.values(earnInformation);
  let maxEarnValues = Math.max(...newValues2);
  let indexOfHighestEarningDriver = newValues2.indexOf(maxEarnValues);

  // console.log(resolvedDriverInformation)

  output = {
    noOfCashTrips: isCash,
    noOfNonCashTrips: nonCash,
    billedTotal: Number(totalBilledAmount.toFixed(2)),
    cashBilledTotal: Number(totalIsCash.toFixed(2)),
    nonCashBilledTotal: Number(totalIsNonCash.toFixed(2)),
    noOfDriversWithMoreThanOneVehicle: noOfDriversWithMoreOneVehicle,

    mostTripsByDriver: {
      name: resolvedDriverInformation[indexMaxTripsByDriver].value.name,
      email: resolvedDriverInformation[indexMaxTripsByDriver].value.email,
      phone: resolvedDriverInformation[indexMaxTripsByDriver].value.phone,
      noOfTrips: newValues[indexMaxTripsByDriver],
      totalAmountEarned: newValues2[indexMaxTripsByDriver],
    },

    highestEarningDriver: {
      name: resolvedDriverInformation[indexOfHighestEarningDriver].value.name,
      email: resolvedDriverInformation[indexOfHighestEarningDriver].value.email,
      phone: resolvedDriverInformation[indexOfHighestEarningDriver].value.phone,
      noOfTrips: newValues[indexOfHighestEarningDriver],
      totalAmountEarned: maxEarnValues,
    },
  };
  return output;
}


module.exports = analysis;
