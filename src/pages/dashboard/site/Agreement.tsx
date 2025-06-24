import React from 'react'
import { useGetSiteAgreement} from '@/hooks/site-agreement/use-agreement';
const Agreement = () => {

  const {
    data: agreement = [],
    isLoading,
    error
  } = useGetSiteAgreement();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  console.log('Agreement Data:', agreement);

  return (
    <div>
      hi
    </div>
  )
}

export default Agreement;