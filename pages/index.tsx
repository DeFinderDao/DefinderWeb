export default function index() {
  return (
      <></>
  );
}

export async function getServerSideProps({locale}:{locale:string}) {
  const defaultHome = locale === 'zh' ? process.env.HOME_PAGE : `/en${process.env.HOME_PAGE}`;
  return {
      redirect: {
        destination: defaultHome,
        permanent: true,
      },
    }
  }
