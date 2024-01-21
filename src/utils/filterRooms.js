// import dayjs from 'dayjs';
// import isBetween from 'dayjs/plugin/isBetween';
// import Booking from '../models/Booking';
const dayjs = require('dayjs');
const isBetween = require('dayjs/plugin/isBetween');
const Booking = require('../models/Booking');

dayjs.extend(isBetween);
const msInOneDay = 86400000;

const filterRooms = async (items, filters) => {
  if (!items || items?.length === 0) return;
  let filteredItems = items;
  filters.arrivalDate = Number(filters.arrivalDate) || Date.now();
  filters.departureDate = Number(filters.departureDate) || Date.now() + msInOneDay;

  const bookings = await Booking.find();
  const bookedRoomsIds = bookings
    .filter(
      booking =>
        dayjs(filters.arrivalDate).isBetween(dayjs(booking.arrivalDate), dayjs(booking.departureDate)) ||
        dayjs(filters.departureDate).isBetween(dayjs(booking.arrivalDate), dayjs(booking.departureDate)) ||
        dayjs(booking.arrivalDate).isBetween(dayjs(filters.arrivalDate), dayjs(filters.departureDate))
    )
    .map(booking => booking.roomId.toString());

  filteredItems = filteredItems.filter(room => !bookedRoomsIds.includes(room._id.toString()));

  if (filters.hasWifi) {
    filteredItems = filteredItems.filter(el => (el.comforts ? el.comforts.includes('hasWifi') : false));
  }

  if (filters.hasConditioner) {
    filteredItems = filteredItems.filter(el => (el.comforts ? el.comforts.includes('hasConditioner') : false));
  }

  if (filters.hasWorkSpace) {
    filteredItems = filteredItems.filter(el => (el.comforts ? el.comforts.includes('hasWorkSpace') : false));
  }

  if (filters.canSmoke) {
    filteredItems = filteredItems.filter(room => room.canSmoke);
  }

  if (filters.canPets) {
    filteredItems = filteredItems.filter(room => room.canPets);
  }

  if (filters.canInvite) {
    filteredItems = filteredItems.filter(room => room.canInvite);
  }

  if (filters.hasWideHallway) {
    filteredItems = filteredItems.filter(room => room.hasWideHallway);
  }

  if (filters.hasDisabledAssistant) {
    filteredItems = filteredItems.filter(room => room.hasDisabledAssistant);
  }

  if (filters && filters.price) {
   const  filteredPriceFirst = filters.price[0];
   const  filteredPriceSecond = filters.price[1];
    filteredItems = filteredItems.filter(room => room.price >= filteredPriceFirst && room.price <= filteredPriceSecond);
  }

  return filteredItems;
};

// export default filterRooms;
module.exports = { filterRooms };
