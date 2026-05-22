export type ExampleOperation = {
  id: string;
  label: string;
  family: 'Terminal' | 'Payment';
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
    id: 'terminal-checkin',
    label: 'Terminal check-in',
    family: 'Terminal',
    method: 'POST',
    path: '/terminal/checkin',
    sn: '10298371039',
    key: '68d499beda5f72116592f5c527465656',
    rawBody:
      '{"terminal_sn":"10298371039","device_id":"android-imei-001","os_info":"Android 14","sdk_version":"muwe-openapi-1.0.0"}'
  },
  {
    id: 'pay',
    label: 'Pay',
    family: 'Payment',
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
    family: 'Payment',
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
    family: 'Payment',
    method: 'POST',
    path: '/upay/v2/query',
    sn: '10298371039',
    key: '68d499beda5f72116592f5c527465656',
    rawBody: '{"terminal_sn":"10298371039","client_sn":"MEX202605220001"}'
  },
  {
    id: 'refund',
    label: 'Refund',
    family: 'Payment',
    method: 'POST',
    path: '/upay/v2/refund',
    sn: '10298371039',
    key: '68d499beda5f72116592f5c527465656',
    rawBody:
      '{"terminal_sn":"10298371039","client_sn":"MEX202605220001","refund_request_no":"RF202605220001","refund_amount":"500","operator":"cashier01"}'
  },
  {
    id: 'cancel',
    label: 'Cancel',
    family: 'Payment',
    method: 'POST',
    path: '/upay/v2/cancel',
    sn: '10298371039',
    key: '68d499beda5f72116592f5c527465656',
    rawBody: '{"terminal_sn":"10298371039","client_sn":"MEX202605220001"}'
  },
  {
    id: 'revoke',
    label: 'Revoke',
    family: 'Payment',
    method: 'POST',
    path: '/upay/v2/revoke',
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

function paymentSuccess(operationId: string, body: Record<string, unknown>, clientSn: string): Record<string, unknown> {
  const totalAmount = String(body.total_amount || '1000');
  switch (operationId) {
    case 'terminal-checkin':
      return {
        result_code: '200',
        biz_response: {
          terminal_sn: String(body.terminal_sn || '10298371039'),
          terminal_key: '9d8d241c9912f0b7d7b45d93d7d81e40'
        }
      };
    case 'precreate':
      return {
        result_code: '200',
        biz_response: {
          result_code: 'PRECREATE_SUCCESS',
          data: {
            sn: '7893259247405833',
            client_sn: clientSn,
            order_status: 'CREATED',
            qr_code: 'weixin://wxpay/bizpayurl?pr=example',
            total_amount: totalAmount,
            subject: String(body.subject || 'QR test order')
          }
        }
      };
    case 'query':
      return {
        result_code: '200',
        biz_response: {
          result_code: 'SUCCESS',
          data: {
            sn: '7893259247405832',
            client_sn: clientSn,
            status: 'SUCCESS',
            order_status: 'PAID',
            payway: '3',
            payway_name: 'Wechat pay',
            total_amount: totalAmount,
            net_amount: totalAmount,
            finish_time: '1779436800000'
          }
        }
      };
    case 'refund':
      return {
        result_code: '200',
        biz_response: {
          result_code: 'REFUND_SUCCESS',
          data: {
            sn: '7893259247405832',
            client_sn: clientSn,
            client_tsn: `${clientSn}-${String(body.refund_request_no || 'RF202605220001')}`,
            status: 'SUCCESS',
            order_status: 'PARTIAL_REFUNDED',
            total_amount: totalAmount,
            net_amount: String(Number(totalAmount) - Number(body.refund_amount || '500'))
          }
        }
      };
    case 'cancel':
      return {
        result_code: '200',
        biz_response: {
          result_code: 'CANCEL_SUCCESS',
          data: {
            sn: '7893259247405832',
            client_sn: clientSn,
            status: 'SUCCESS',
            order_status: 'CANCELED',
            total_amount: totalAmount,
            net_amount: '0'
          }
        }
      };
    case 'revoke':
      return {
        result_code: '200',
        biz_response: {
          result_code: 'REVOKE_SUCCESS',
          data: {
            sn: '7893259247405832',
            client_sn: clientSn,
            status: 'SUCCESS',
            order_status: 'REVOKED',
            total_amount: totalAmount,
            net_amount: '0'
          }
        }
      };
    default:
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
            total_amount: totalAmount,
            net_amount: totalAmount,
            subject: String(body.subject || 'MUWE test order'),
            operator: String(body.operator || 'cashier01'),
            finish_time: '1779436800000'
          }
        }
      };
  }
}

export function mockResponse(scenario: SimulatorScenario, operationId: string, rawBody: string): Record<string, unknown> {
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
      return paymentSuccess(operationId, body, clientSn);
    case 'IN_PROGRESS':
      return {
        result_code: '200',
        biz_response: {
          result_code: operationId === 'refund' ? 'REFUND_IN_PROGRESS' : 'PAY_IN_PROGRESS',
          data: {
            sn: '789200393929142',
            client_sn: clientSn,
            status: 'IN_PROG',
            order_status: operationId === 'terminal-checkin' ? undefined : 'CREATED',
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
        error_message: 'Required request fields are missing or invalid for this operation'
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
