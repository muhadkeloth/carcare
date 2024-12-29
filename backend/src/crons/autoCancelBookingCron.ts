import cron from 'node-cron'
import PickupService from '../services/PickupService';
import PickupRepository from '../repositories/PickupRepository';
import Pickups from '../models/Pickups';
import Bookings from '../models/Bookings';
import BookingRepository from '../repositories/BookingRepository';
import BookingService from '../services/BookingService';
import { sendCancelEmail } from '../utils/emailService';
import logger from '../middleware/logger';

const pickupService = new PickupService(new PickupRepository(Pickups))
const bookingService = new BookingService(new BookingRepository(Bookings))

const autoCancelCron = () => {
    cron.schedule('0,30 8-19 * * 1-6',async()=>{
        const [pickups, bookings] = await Promise.all([
            pickupService.getOverduePickups(30),
            bookingService.getOverdueBookings(30),
        ] )
        if(pickups && pickups?.length > 0){
            const pickupPromises = pickups.map(pickup => 
                Promise.all([
                    pickupService.togglePickupStatus(pickup._id as string,'CANCELED',`no response from ${pickup.userDetails.firstName}`,'shop'),
                    sendCancelEmail({
                        email:pickup.userDetails.email,
                        username:pickup.userDetails.firstName,
                        time:pickup.shedule.time,
                        date:pickup.shedule.date
                    },'Pickup')
                ])
            );          
            await Promise.all(pickupPromises)
        }
        if (bookings && bookings?.length > 0) {
          const bookingPromises = bookings.map((booking) =>
            Promise.all([
                bookingService.toggleBookingStatus(booking._id as string,'CANCELED',`no response from ${booking.userDetails.firstName}`,'shop'),
                sendCancelEmail({
                    email:booking.userDetails.email,
                    username:booking.userDetails.firstName,
                    time:booking.shedule.time,
                    date:booking.shedule.date
                },'Booking'),
            ])
          );
          await Promise.all(bookingPromises);
        }
        logger.info('sheduled cancel booking emails send by Cron Jobs')
    })

}

export default autoCancelCron;