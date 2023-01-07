import http from 'k6/http';
import { check } from 'k6';
import { Rate } from 'k6/metrics';

const username = __ENV.ES_USERNAME || 'elastic';
const password = __ENV.ES_PASSWORD || 'password';
const index = __ENV.INDEX || 'test';
const url = __ENV.URL || 'localhost:9200' ;

console.log("index", index, "user", username, "url", url)

const params = {
    headers: {
      'Content-Type': 'application/json',
    },
};

export let options = {
    vus: 200,
    duration: '30s',
    insecureSkipTLSVerify: true,
};


export const errorRate = new Rate('errors');

export default function () {
  const credentials = `${username}:${password}`;

  const reqUel = `https://${credentials}@${url}/${index}/_search`;

  console.log("Starting Load Test. URL: ", reqUel)

  const p1 = JSON.stringify(
    {
      "query": {
             "match_all": {}
         }
     }
  );

  let res = http.post(reqUel, p1, params);
    
  check(res, {
    'Q1 status is 200': (r) => r.status === 200
  }) || errorRate.add(1);

  const p2 = JSON.stringify(
    {
        "query": {
            "query_string": {
                "query": "OriginCityName:Frankfurt*"
            }
        }
    }    
  );

  res = http.post(reqUel, p2, params);
    
  check(res, {
    'Q2 status is 200': (r) => r.status === 200
  }) || errorRate.add(1);

  const p3 = JSON.stringify(
    {
        "query": {
            "query_string": {
                "query": "Rain"
            }
        }
    }       
  );

  res = http.post(reqUel, p3, params);
    
  check(res, {
    'Q3 status is 200': (r) => r.status === 200
  }) || errorRate.add(1);

  const p4 = JSON.stringify(
    {
        "query": {
            "query_string": {
                "query": "test"
            }
        }
    }     
  );

  res = http.post(reqUel, p4, params);
    
  check(res, {
    'Q4 status is 200': (r) => r.status === 200
  }) || errorRate.add(1);

  const p5 = JSON.stringify(
    {
      "query": {
          "query_string": {
              "query": "OriginCountry:DE"
          }
      }
  }   
  );

  res = http.post(reqUel, p5, params);
    
  check(res, {
    'Q5 status is 200': (r) => r.status === 200
  }) || errorRate.add(1);



  console.log("Completed!")
}