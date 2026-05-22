export type ExampleOperation = {
  id: string;
  label: string;
  method: 'POST';
  path: string;
  sn: string;
  key: string;
  rawBody: string;
};

export type SimulatorScenario =
  | 'SUCCESS'
  | 'IN_PROGRESS'
  | 'SIGN_ERROR'
  | 'PARAM_ERROR'
  | 'ORDER_NOT_FOUND'
  | 'DUPLICATE_REQUEST';

export const baseUrl = 'https://vsi-api.shouqianba.com';

export const contractExamples: ExampleOperation[] = [
  {
    id: 'pay',
    label: 'Pay',
    method: 'POST',
    path: '/upay/v2/pay',
    sn: '10298371039',
    key: '68d499beda5f72116592f5c527465656',
    rawBody:
      '{"terminal_sn":"10298371039","client_sn":"MEX202605220001","total_amount":"1000","dynamic_id":"130818341921441147","subject":"MUWE test order","operator":"cashier01","notify_url":"https://partner.example.mx/muwe/notify"}'
  },
  {
    id: 'precreate',
    label: 'Pre-create',
    method: 'POST',
    path: '/upay/v2/precreate',
    sn: '10298371039',
    key: '68d499beda5f72116592f5c527465656',
    rawBody:
      '{"terminal_sn":"10298371039","client_sn":"MEX202605220002","total_amount":"2500","payway":"3","sub_payway":"2","subject":"QR test order","operator":"cashier01"}'
  },
  {
    id: 'query',
    label: 'Query',
    method: 'POST',
    path: '/upay/v2/query',
    sn: '10298371039',
    key: '68d499beda5f72116592f5c527465656',
    rawBody: '{"terminal_sn":"10298371039","client_sn":"MEX202605220001"}'
  }
];

export function parseBody(rawBody: string): Record<string, unknown> {
  const parsed = JSON.parse(rawBody);
  if (!parsed || typeof parsed !== 'object' || Array.isArray(parsed)) {
    throw new Error('Request body must be a JSON object.');
  }
  return parsed as Record<string, unknown>;
}

export function mockResponse(scenario: SimulatorScenario, rawBody: string): Record<string, unknown> {
  let body: Record<string, unknown> = {};
  try {
    body = parseBody(rawBody);
  } catch {
    if (scenario !== 'SIGN_ERROR') {
      return {
        result_code: '400',
        error_code: 'INVALID_PARAMS',
        error_message: 'JSON body is not a valid object'
      };
    }
  }

  const clientSn = typeof body.client_sn === 'string' ? body.client_sn : 'MEX202605220001';

  switch (scenario) {
    case 'SUCCESS':
      return {
        result_code: '200',
        biz_response: {
          result_code: 'PAY_SUCCESS',
          data: {
            sn: '7893259247405832',
            client_sn: clientSn,
            status: 'SUCCESS',
            order_status: 'PAID',
            payway: '3',
            sub_payway: '1',
            total_amount: String(body.total_amount || '1000'),
            net_amount: String(body.total_amount || '1000'),
            subject: String(body.subject || 'MUWE test order'),
            operator: String(body.operator || 'cashier01'),
            finish_time: '1779436800000'
          }
        }
      };
    case 'IN_PROGRESS':
      return {
        result_code: '200',
        biz_response: {
          result_code: 'PAY_IN_PROGRESS',
          data: {
            sn: '789200393929142',
            client_sn: clientSn,
            status: 'IN_PROG',
            order_status: 'CREATED',
            total_amount: String(body.total_amount || '1000')
          }
        }
      };
    case 'SIGN_ERROR':
      return {
        result_code: '400',
        error_code: 'ILLEGAL_SIGN',
        error_message: 'Signature validation failed'
      };
    case 'PARAM_ERROR':
      return {
        result_code: '400',
        error_code: 'INVALID_PARAMS',
        error_message: 'terminal_sn, client_sn, total_amount, dynamic_id, subject, and operator are required'
      };
    case 'ORDER_NOT_FOUND':
      return {
        result_code: '200',
        biz_response: {
          result_code: 'ORDER_NOT_FOUND',
          error_code: 'ORDER_NOT_FOUND',
          error_message: 'Order does not exist'
        }
      };
    case 'DUPLICATE_REQUEST':
      return {
        result_code: '200',
        biz_response: {
          result_code: 'DUPLICATE_REQUEST',
          error_code: 'DUPLICATE_REQUEST',
          error_message: 'client_sn was already used for an existing payment attempt'
        }
      };
  }
}
