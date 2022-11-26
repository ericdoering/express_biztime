const request = require("supertest");

const app = require("../app");
const {createData} = require("../_test-common");
const db = require("../db");



beforeEach(createData);


afterAll(async () => {
    await db.end()
});



describe("GET /", () => {
    test("It should respond by displaying an array of companies", async () => {
        const response = await request(app).get("/companies");
        expect(response.body).toEqual({"companies": [
            {code: "apple", name: "Apple"},
            {code: "ibm", name: "IBM"},
        ]});
    })
});



describe("GET /apple", () => {
    test("It should return company info", async () => {
      const response = await request(app).get("/companies/apple");
      expect(response.body).toEqual(
          {"company": {
            code: "apple",
            name: "Apple",
            description: "Maker of OSX.",
            invoices: [1, 2],
            }
          }
      );
    });
  
    test("It should return a 404 message if the company does not exist", async () => {
      const response = await request(app).get("/companies/Meta");
      expect(response.status).toEqual(404);
    })
  });
  


  describe("POST /", () => {
    test("It should add company", async () => {
      const response = await request(app)
          .post("/companies")
          .send({name: "Amazon", description: "AWS Systems"});
  
      expect(response.body).toEqual(
          {
            "company": {
              code: "AWS",
              name: "Amazon",
              description: "AWS Systems",
            }
          }
      );
    });
  
    test("It should return 500 for conflict", async () => {
      const response = await request(app)
          .post("/companies")
          .send({name: "TikTok", description: "Dance"});
  
      expect(response.status).toEqual(500);
    })
  });
  


  describe("PUT /", () => {
    test("It should update an existing company", async () => {
      const response = await request(app)
          .put("/companies/apple")
          .send({name: "AppleEdit", description: "NewDescrip"});
  
      expect(response.body).toEqual(
          {
            "company": {
              code: "apple",
              name: "AppleEdit",
              description: "NewDescrip",
            }
          }
      );
    });
  
    test("It should return 404 if the company does not exist", async () => {
      const response = await request(app)
          .put("/companies/Meta")
          .send({name: "Meta"});
  
      expect(response.status).toEqual(404);
    });
  
    test("It should return 500 for missing data", async () => {
      const response = await request(app)
          .put("/companies/apple")
          .send({});
  
      expect(response.status).toEqual(500);
    })
  });



  describe("DELETE /", () => {
    test("It should delete a company", async () => {
      const response = await request(app)
          .delete("/companies/apple");
  
      expect(response.body).toEqual({"status": "deleted"});
    });
  
    test("It should return 404 if the company does not exist", async () => {
      const response = await request(app)
          .delete("/companies/Meta");
  
      expect(response.status).toEqual(404);
    });
  });

  

