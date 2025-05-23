import React, { useEffect, useState } from 'react';
import Swal from 'sweetalert2';

// Define types for the props
interface CheckPaymentProps {
  totalMoney: number;
  txt: string;
  onPaymentSuccess: () => void;  
}
interface PaymentItem {
  "Mã GD": number;
  "Mô tả": string;
  "Giá trị": number;
  "Ngày diễn ra": string;
  "Số tài khoản": string;
}
const CheckPayment: React.FC<CheckPaymentProps> = ({ totalMoney, txt,onPaymentSuccess }) => {
  

    console.log({totalMoney, txt,onPaymentSuccess})
  const [paidLoad, setPaidLoad] = useState<number>(0);
  useEffect(() => {
    const interval = setInterval(() => {
      async function checkPay() {
        const response = await fetch(
          'https://script.googleusercontent.com/macros/echo?user_content_key=r7S_GvxGdl-AfJpjkd5NbAroWLxgDYeb3iVz7_Hh_D0vdVHQqPStrpkJrAK1HTU7dtp_vX5o7PXhT3KEaMpM6nkmGomLPKx0m5_BxDlH2jW0nuo2oDemN9CCS2h10ox_1xSncGQajx_ryfhECjZEnP8argURt8ZMi-D9kZTDB-XnFQusGZK8JqhXpRuMQQ_q4VyKGvX2akzZ2O6nv5L9CzJMyn4zYaK-bb32IMZwRWAlcauYPO8yng&lib=MHlL8RN1boYWEFmcjcb_Mjs9owhmw9jII'
        );
        const data = await response.json();
        console.log(data)
        data.data.forEach((item:PaymentItem ) => {
          if (item['Mô tả'].includes(txt)) {
            if (item['Giá trị'] === totalMoney) {
              setPaidLoad(1);
              Swal.fire({
                title: 'Payment Successful!',
                text: 'Thank you. Enjoy your meal!',
                icon: 'success',
              }).then(() => {
                onPaymentSuccess();
              });
              clearInterval(interval);
            } else {
              setPaidLoad(0);
            }
          }
        });
      }

      checkPay();
    }, 1000 * 5);

    return () => clearInterval(interval);
  }, [totalMoney, txt,onPaymentSuccess]);

  return <input type="hidden" id="paidLoad" value={paidLoad} />;
};

export default CheckPayment;
