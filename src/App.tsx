import React, { useState } from 'react';
import { Calendar, Clock, User, Phone, Mail, Calendar as CalendarIcon, ChevronLeft, ChevronRight } from 'lucide-react';
import { format, addDays, startOfToday, isToday, isTomorrow, isAfter, isBefore, parseISO } from 'date-fns';

interface Service {
  id: number;
  name: string;
  duration: string;
  price: number;
  image: string;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentDetails {
  service: Service | null;
  date: Date | null;
  time: string | null;
  name: string;
  email: string;
  phone: string;
}

function App() {
  const [step, setStep] = useState<number>(1);
  const [appointment, setAppointment] = useState<AppointmentDetails>({
    service: null,
    date: null,
    time: null,
    name: '',
    email: '',
    phone: ''
  });

  const services: Service[] = [
    {
      id: 1,
      name: 'Dental Checkup',
      duration: '30 min',
      price: 1500,
      image: 'https://images.unsplash.com/photo-1588776814546-1ffcf47267a5?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 2,
      name: 'Root Canal',
      duration: '60 min',
      price: 5000,
      image: 'https://images.unsplash.com/photo-1606811971618-4486d14f3f99?auto=format&fit=crop&q=80&w=400'
    },
    {
      id: 3,
      name: 'Teeth Whitening',
      duration: '45 min',
      price: 3000,
      image: 'https://images.unsplash.com/photo-1541604193435-22287d32c2c2?auto=format&fit=crop&q=80&w=400'
    }
  ];

  const timeSlots: TimeSlot[] = [
    { time: '09:00', available: true },
    { time: '10:00', available: true },
    { time: '11:00', available: false },
    { time: '12:00', available: true },
    { time: '14:00', available: true },
    { time: '15:00', available: true },
    { time: '16:00', available: false },
    { time: '17:00', available: true }
  ];

  const [selectedDate, setSelectedDate] = useState<Date>(startOfToday());
  const nextSevenDays = Array.from({ length: 7 }, (_, i) => addDays(startOfToday(), i));

  const handleServiceSelect = (service: Service) => {
    setAppointment(prev => ({ ...prev, service }));
    setStep(2);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setAppointment(prev => ({ ...prev, date }));
  };

  const handleTimeSelect = (time: string) => {
    setAppointment(prev => ({ ...prev, time }));
    setStep(3);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the appointment data to your backend
    console.log('Appointment Details:', appointment);
    setStep(4);
  };

  const formatDate = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'EEE, MMM d');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Book an Appointment</h1>
          <div className="flex mt-4">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div key={stepNumber} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div className={`h-1 w-12 ${
                    step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Select a Service</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {services.map(service => (
                <button
                  key={service.id}
                  onClick={() => handleServiceSelect(service)}
                  className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
                >
                  <img src={service.image} alt={service.name} className="w-full h-48 object-cover" />
                  <div className="p-4">
                    <h3 className="font-semibold text-lg">{service.name}</h3>
                    <div className="flex justify-between mt-2 text-gray-600">
                      <span className="flex items-center">
                        <Clock size={16} className="mr-1" />
                        {service.duration}
                      </span>
                      <span>₹{service.price}</span>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Select Date & Time</h2>
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ChevronLeft size={24} />
                </button>
                <div className="flex space-x-2">
                  {nextSevenDays.map((date) => (
                    <button
                      key={date.toISOString()}
                      onClick={() => handleDateSelect(date)}
                      className={`px-4 py-2 rounded-lg ${
                        selectedDate.toDateString() === date.toDateString()
                          ? 'bg-blue-600 text-white'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="text-sm">{format(date, 'EEE')}</div>
                      <div className="font-semibold">{format(date, 'd')}</div>
                    </button>
                  ))}
                </div>
                <button className="p-2 hover:bg-gray-100 rounded-full">
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-4">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    onClick={() => slot.available && handleTimeSelect(slot.time)}
                    disabled={!slot.available}
                    className={`p-3 rounded-lg text-center ${
                      appointment.time === slot.time
                        ? 'bg-blue-600 text-white'
                        : slot.available
                        ? 'bg-gray-50 hover:bg-gray-100'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold mb-6">Your Information</h2>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name
                  </label>
                  <div className="relative">
                    <User size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      required
                      value={appointment.name}
                      onChange={(e) => setAppointment(prev => ({ ...prev, name: e.target.value }))}
                      className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="John Doe"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <div className="relative">
                    <Mail size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="email"
                      required
                      value={appointment.email}
                      onChange={(e) => setAppointment(prev => ({ ...prev, email: e.target.value }))}
                      className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Phone size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="tel"
                      required
                      value={appointment.phone}
                      onChange={(e) => setAppointment(prev => ({ ...prev, phone: e.target.value }))}
                      className="pl-10 w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="+91 98765 43210"
                    />
                  </div>
                </div>

                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <h3 className="font-medium mb-2">Appointment Summary</h3>
                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <CalendarIcon size={16} className="mr-2" />
                      <span>{appointment.service?.name}</span>
                    </div>
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-2" />
                      <span>{appointment.date && formatDate(appointment.date)}</span>
                    </div>
                    <div className="flex items-center">
                      <Clock size={16} className="mr-2" />
                      <span>{appointment.time}</span>
                    </div>
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Confirm Booking
                </button>
              </div>
            </form>
          </div>
        )}

        {step === 4 && (
          <div className="text-center max-w-2xl mx-auto bg-white rounded-lg shadow-md p-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Calendar className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">Booking Confirmed!</h2>
            <p className="text-gray-600 mb-6">
              Your appointment has been successfully scheduled. We've sent a confirmation email with all the details.
            </p>
            <div className="bg-gray-50 p-6 rounded-lg text-left">
              <h3 className="font-medium mb-4">Appointment Details</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Service:</span>
                  <span className="font-medium">{appointment.service?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Date:</span>
                  <span className="font-medium">
                    {appointment.date && format(appointment.date, 'MMMM d, yyyy')}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Time:</span>
                  <span className="font-medium">{appointment.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-medium">{appointment.service?.duration}</span>
                </div>
              </div>
            </div>
            <button
              onClick={() => {
                setStep(1);
                setAppointment({
                  service: null,
                  date: null,
                  time: null,
                  name: '',
                  email: '',
                  phone: ''
                });
              }}
              className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Book Another Appointment
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;