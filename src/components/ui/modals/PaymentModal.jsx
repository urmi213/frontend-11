import { useState } from 'react'
import { FaCreditCard, FaLock, FaCalendarAlt, FaUser } from 'react-icons/fa'
import toast from 'react-hot-toast'

const PaymentModal = ({ 
  isOpen, 
  onClose, 
  amount = 0,
  onPaymentSuccess,
  loading = false
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card')
  const [cardDetails, setCardDetails] = useState({
    number: '',
    expiry: '',
    cvc: '',
    name: ''
  })
  const [agreeTerms, setAgreeTerms] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!agreeTerms) {
      toast.error('Please agree to the terms and conditions')
      return
    }

    if (paymentMethod === 'card') {
      // Validate card details
      if (!cardDetails.number || !cardDetails.expiry || !cardDetails.cvc || !cardDetails.name) {
        toast.error('Please fill all card details')
        return
      }
    }

    // Here you would integrate with Stripe or other payment gateway
    toast.success('Payment processed successfully!')
    
    if (onPaymentSuccess) {
      onPaymentSuccess({
        amount,
        method: paymentMethod,
        transactionId: `txn_${Date.now()}`
      })
    }
    
    onClose()
  }

  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    value = value.substring(0, 16)
    
    // Add spaces every 4 digits
    if (value.length > 0) {
      value = value.match(/.{1,4}/g).join(' ')
    }
    
    setCardDetails({ ...cardDetails, number: value })
  }

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '')
    
    if (value.length >= 2) {
      value = value.substring(0, 2) + '/' + value.substring(2, 4)
    }
    
    setCardDetails({ ...cardDetails, expiry: value.substring(0, 5) })
  }

  if (!isOpen) return null

  return (
    <div className="modal modal-open">
      <div className="modal-box max-w-2xl">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold">Make a Donation</h3>
          <button onClick={onClose} className="btn btn-sm btn-circle">✕</button>
        </div>

        {/* Amount Summary */}
        <div className="card bg-primary text-primary-content mb-6">
          <div className="card-body">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="font-bold">Donation Amount</h4>
                <p className="text-sm">Support our blood donation initiative</p>
              </div>
              <div className="text-3xl font-bold">
                ৳{amount.toLocaleString()}
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Payment Method Selection */}
          <div className="mb-6">
            <h4 className="font-bold mb-4">Select Payment Method</h4>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                className={`btn ${paymentMethod === 'card' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setPaymentMethod('card')}
              >
                <FaCreditCard className="mr-2" />
                Credit/Debit Card
              </button>
              <button
                type="button"
                className={`btn ${paymentMethod === 'mobile' ? 'btn-primary' : 'btn-outline'}`}
                onClick={() => setPaymentMethod('mobile')}
              >
                <FaCreditCard className="mr-2" />
                Mobile Banking
              </button>
            </div>
          </div>

          {/* Card Details */}
          {paymentMethod === 'card' && (
            <div className="space-y-4 mb-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Card Number</span>
                </label>
                <div className="relative">
                  <FaCreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="1234 5678 9012 3456"
                    className="input input-bordered w-full pl-10"
                    value={cardDetails.number}
                    onChange={handleCardNumberChange}
                    maxLength={19}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="form-control">
                  <label className="label">
                    <span className="label-text">Expiry Date</span>
                  </label>
                  <div className="relative">
                    <FaCalendarAlt className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="MM/YY"
                      className="input input-bordered w-full pl-10"
                      value={cardDetails.expiry}
                      onChange={handleExpiryChange}
                      maxLength={5}
                    />
                  </div>
                </div>

                <div className="form-control">
                  <label className="label">
                    <span className="label-text">CVC</span>
                  </label>
                  <div className="relative">
                    <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="123"
                      className="input input-bordered w-full pl-10"
                      value={cardDetails.cvc}
                      onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value.replace(/\D/g, '').substring(0, 4) })}
                      maxLength={4}
                    />
                  </div>
                </div>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Cardholder Name</span>
                </label>
                <div className="relative">
                  <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="John Doe"
                    className="input input-bordered w-full pl-10"
                    value={cardDetails.name}
                    onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                  />
                </div>
              </div>
            </div>
          )}

          {/* Mobile Banking */}
          {paymentMethod === 'mobile' && (
            <div className="space-y-4 mb-6">
              <div className="form-control">
                <label className="label">
                  <span className="label-text">Select Provider</span>
                </label>
                <select className="select select-bordered w-full">
                  <option value="">Select Mobile Banking</option>
                  <option value="bkash">bKash</option>
                  <option value="nagad">Nagad</option>
                  <option value="rocket">Rocket</option>
                  <option value="upay">Upay</option>
                </select>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Mobile Number</span>
                </label>
                <input
                  type="text"
                  placeholder="01XXXXXXXXX"
                  className="input input-bordered w-full"
                />
              </div>

              <div className="alert alert-info">
                <div>
                  <h4 className="font-bold">Payment Instructions</h4>
                  <ul className="text-sm mt-2 space-y-1">
                    <li>1. Select your mobile banking provider</li>
                    <li>2. Enter your registered mobile number</li>
                    <li>3. You will receive a payment request</li>
                    <li>4. Complete payment through your app</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* Terms and Conditions */}
          <div className="form-control mb-6">
            <label className="label cursor-pointer justify-start gap-3">
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
              />
              <span className="label-text">
                I agree to the <a href="#" className="link link-primary">Terms & Conditions</a> and authorize this payment
              </span>
            </label>
          </div>

          {/* Security Info */}
          <div className="alert alert-success mb-6">
            <FaLock />
            <div>
              <h4 className="font-bold">Secure Payment</h4>
              <p className="text-sm">Your payment is secured with SSL encryption</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="modal-action">
            <button type="button" className="btn btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className={`btn btn-primary ${loading ? 'loading' : ''}`}
              disabled={loading || !agreeTerms}
            >
              {loading ? 'Processing...' : `Pay ৳${amount.toLocaleString()}`}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default PaymentModal