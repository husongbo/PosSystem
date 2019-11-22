import request from '@/utils/requst'

export function UserLogin(data){
  return request({
    url: '/MerchantLogin',
    method: 'get',
    params: query
  })
}


