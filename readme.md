### service schema document:

Add this in mongoDB collection:

```json
{
  "_id": {
    "$oid": "6204009318c51a030797bf24"
  },
  "name": "Gupshup",
  "limiters": [
    {
      "name": "getMinutes",
      "duration": 1,
      "count": 0,
      "maxLimit": 2,
      "time": 16,
      "_id": {
        "$oid": "6204009318c51a030797bf25"
      }
    },
    {
      "name": "getDay",
      "duration": 1440,
      "count": 0,
      "maxLimit": 2,
      "time": 4,
      "_id": {
        "$oid": "6204009318c51a030797bf26"
      }
    },
    {
      "name": "getMonth",
      "duration": 43829,
      "count": 0,
      "maxLimit": 2,
      "time": 1,
      "_id": {
        "$oid": "6204009318c51a030797bf27"
      }
    }
  ],
  "createdAt": {
    "$date": "2022-02-09T17:57:40.035Z"
  },
  "updatedAt": {
    "$date": "2022-02-10T15:46:39.354Z"
  },
  "__v": 0,
  "apiKey": "fv1irahwpfux9ov6fireebdgt8jbxhl5",
  "appName": "DemoAppAbhinav",
  "source": "917834811114"
}
```
