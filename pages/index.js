import cache from "../src/cache";

export default function Home({ coupon }) {
  return (
    <div>
      {coupon ? (
        <h1>{coupon} کد تخفیف شما </h1>
      ) : (
        <h1>متاسفانه برای منطقه شما کد تخفیفی وجود ندارد</h1>
      )}
    </div>
  );
}

export const getServerSideProps = async () => {
  const country = "RU"

  const fetcher = async () => {
    const url = `https://api.purchasing-power-parity.com/?target=${country}`
    const response = await fetch(url)
    const data = await response.json()

    let coupon = null
    if (data.ppp.pppConversionFactor < 0.25) {
      coupon = "75%"
    } else if (data.ppp.pppConversionFactor < 0.5) {
      coupon = "50%"
    } else if (data.ppp.pppConversionFactor < 0.75) {
      coupon = "25%"
    }
    return coupon
  }

  // "ppp:country" is the key /
  // fetcher is the function that will be called /
  // 60 * 60 will cache for one hour /
  const cachedCoupon = await cache.fetch(`ppp:${country}`, fetcher, 60 * 60)

  return {props: { coupon: cachedCoupon }}
}