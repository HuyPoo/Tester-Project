import { useState } from "react"
import {
  Box,
  Button,
  Container,
  Heading,
  HStack,
  Step,
  StepIcon,
  StepIndicator,
  StepNumber,
  Stepper,
  StepSeparator,
  StepStatus,
  StepTitle,
  useSteps,
  useToast,
  VStack,
} from "@chakra-ui/react"
import Layout from "@/components/Layout.tsx"
import ServiceSelection from "@/components/booking/ServiceSelection.tsx"
import StylistSelection from "@/components/booking/StylistSelection.tsx"
import DateSelection from "@/components/booking/DateSelection.tsx"
import TimeSelection from "@/components/booking/TimeSelection.tsx"
import BookingConfirmation from "@/components/booking/BookingConfirmation.tsx"
import { Service } from "@/types/services.ts"
import { Stylist } from "@/types/stylists.ts"
import { BookingData } from "@/types/appointments.ts"
import { useLocation, useNavigate } from "react-router"
import { appointmentsApi } from "@/api/appointments.ts"
import { AxiosError } from "axios"

const steps = [
  { title: "Service", description: "Choose a service" },
  { title: "Stylist", description: "Select your stylist" },
  { title: "Date", description: "Pick a date" },
  { title: "Time", description: "Select appointment time" },
  { title: "Confirm", description: "Review and confirm" },
]

function BookPage() {
  const navigate = useNavigate()
  const toast = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const location = useLocation()
  const { activeStep, goToNext, goToPrevious, setActiveStep } = useSteps({
    index: 0,
    count: steps.length,
  })
  const [bookingData, setBookingData] = useState<BookingData>(() => {
    const initialService = location.state?.selectedService
    if (initialService == null) {
      return {}
    }
    setActiveStep(1)
    return { service: initialService }
  })

  const handleServiceSelect = (service: Service) => {
    setBookingData({ ...bookingData, service })
    goToNext()
  }

  const handleStylistSelect = (stylist: Stylist) => {
    setBookingData({ ...bookingData, stylist })
    goToNext()
  }

  const handleDateSelect = (date: Date) => {
    setBookingData({ ...bookingData, dateTime: date })
    goToNext()
  }

  const handleTimeSelect = (dateTime: Date) => {
    setBookingData({ ...bookingData, dateTime: dateTime })
    goToNext()
  }
  const handleConfirm = async (notes: string) => {
    if (!bookingData.service?.id || !bookingData.stylist?.id || !bookingData.dateTime) {
      toast({
        title: "Thiếu thông tin",
        description: "Vui lòng hoàn thành tất cả các bước đặt chỗ",
        status: "error",
        duration: 3000,
      })
      return
    }

    setIsLoading(true)
    try {
      await appointmentsApi.createAppointment({
        serviceId: bookingData.service.id,
        stylistId: bookingData.stylist.id,
        dateTime: bookingData.dateTime,
        notes,
      })

      toast({
        title: "Đặt chỗ thành công",
        description: "Cuộc hẹn của bạn đã được lên lịch",
        status: "success",
        duration: 5000,
      })

      // Redirect to appointments page
      navigate("/appointments")
    } catch (error) {
      const axiosError = error as AxiosError<{ message: string }>
      toast({
        title: "Đặt lịch thất bại",
        description: axiosError.response?.data?.message || "Không thể tạo cuộc hẹn",
        status: "error",
        duration: 3000,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepContent = () => {
    const commonProps = {
      width: "100%",
      spacing: 6,
    }

    return (
      <VStack {...commonProps}>
        {activeStep > 0 && activeStep < 4 && (
          <HStack width="100%" justify="space-between" mb={4}>
            <Button variant="ghost" onClick={goToPrevious} isDisabled={isLoading}>
              Back
            </Button>
          </HStack>
        )}

        {activeStep === 0 && <ServiceSelection onSelect={handleServiceSelect} />}
        {activeStep === 1 && <StylistSelection onSelect={handleStylistSelect} serviceId={bookingData.service?.id} />}
        {activeStep === 2 && (
          <DateSelection
            onSelect={handleDateSelect}
            stylistId={bookingData.stylist?.id}
            serviceId={bookingData.service?.id}
          />
        )}
        {activeStep === 3 && (
          <TimeSelection
            onSelect={handleTimeSelect}
            date={bookingData.dateTime}
            stylistId={bookingData.stylist?.id}
            serviceId={bookingData.service?.id}
          />
        )}
        {activeStep === 4 && (
          <BookingConfirmation
            bookingData={bookingData}
            onConfirm={handleConfirm}
            onBack={goToPrevious}
            isLoading={isLoading}
          />
        )}
      </VStack>
    )
  }

  return (
    <Layout>
      <Box minH="100vh" py={20}>
        <Container maxW="4xl">
          <VStack spacing={8}>
            <Heading size="xl">Đặt lịch hẹn</Heading>
            <Stepper index={activeStep} width="100%" mb={8}>
              {steps.map((step, index) => (
                <Step key={index}>
                  <StepIndicator>
                    <StepStatus complete={<StepIcon />} incomplete={<StepNumber />} active={<StepNumber />} />
                  </StepIndicator>
                  <StepTitle>{step.title}</StepTitle>
                  <StepSeparator />
                </Step>
              ))}
            </Stepper>
            {renderStepContent()}
          </VStack>
        </Container>
      </Box>
    </Layout>
  )
}

export default BookPage
