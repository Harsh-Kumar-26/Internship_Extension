import math
import numpy as np
import pandas as pd
from sklearn.preprocessing import MinMaxScaler
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer
from geopy.distance import geodesic
from scipy.optimize import linear_sum_assignment
from dotenv import load_dotenv
import os
from sentence_transformers import SentenceTransformer



load_dotenv()   

GEOAPIFY_API_KEY = os.getenv("GEOAPIFY")

if not GEOAPIFY_API_KEY:
    raise RuntimeError("GEOAPIFY_API_KEY is not set")


MODEL = SentenceTransformer("all-MiniLM-L6-v2")
# # ----------------------------
# # Weights
# # ----------------------------
# TEXT_WEIGHT = 0.55
# LOCATION_WEIGHT = 0.20
# STIPEND_WEIGHT = 0.00
# TREND_WEIGHT = 0.00
# AFFIRMATIVE_WEIGHT = 0.05     # rural/tribal bonus

# LOCATION_DECAY_KM = 50.0
# EMBED_MODEL_NAME = "all-MiniLM-L6-v2"

# # ----------------------------
# # Internships Dataset
# # ----------------------------
# # internships = pd.DataFrame([
# #     {"internship_id": 1, "title":"Data Science Intern","description":"Python Machine Learning Data Analysis","location":"Delhi","stipend":15000,"trend":0.85,"capacity":1},
# #     {"internship_id": 2, "title":"Web Dev Intern","description":"React Node Frontend","location":"Gurgaon","stipend":12000,"trend":0.75,"capacity":1},
# #     {"internship_id": 3, "title":"AI Research Intern","description":"Deep Learning NLP Transformers","location":"Hyderabad","stipend":20000,"trend":0.65,"capacity":1},
# #     {"internship_id": 4, "title":"Marketing Intern","description":"SEO Digital Marketing","location":"Delhi","stipend":8000,"trend":0.55,"capacity":1},
# #     {"internship_id": 5, "title":"Backend Intern","description":"Python Django Microservices","location":"Bangalore","stipend":18000,"trend":0.90,"capacity":1},
# # ])

# internships=internships_df
# # ----------------------------
# # USERS (YOUR SCHEMA)
# # ----------------------------



# # candidates = pd.DataFrame([
# #     {"user_id":101,"skills":"python ml data","location":"Delhi","education":"B.Tech","rural":0,"tribal":0,"category":"GEN","past_participation":0,"expected_stipend":15000},
# #     {"user_id":102,"skills":"react node frontend","location":"Gurgaon","education":"B.Tech","rural":0,"tribal":0,"category":"OBC","past_participation":1,"expected_stipend":12000},
# #     {"user_id":103,"skills":"nlp transformers","location":"Hyderabad","education":"M.Tech","rural":1,"tribal":0,"category":"SC","past_participation":0,"expected_stipend":19000},
# #     {"user_id":104,"skills":"digital marketing seo","location":"Delhi","education":"MBA","rural":1,"tribal":1,"category":"ST","past_participation":0,"expected_stipend":9000},
# #     {"user_id":105,"skills":"django backend python","location":"Bangalore","education":"B.Tech","rural":0,"tribal":0,"category":"GEN","past_participation":1,"expected_stipend":18000},
# # ])
# candidates=users_df
# # ----------------------------
# # Embeddings
# # ----------------------------
# model = SentenceTransformer(EMBED_MODEL_NAME)
# item_embeddings = model.encode(
#     internships["description"].tolist(),
#     normalize_embeddings=True
# )

# # ----------------------------
# # Location Utils
# # ----------------------------
# # CITY_COORDS = {
# #     "delhi": (28.70, 77.10),
# #     "gurgaon": (28.45, 77.02),
# #     "hyderabad": (17.38, 78.48),
# #     "bangalore": (12.97, 77.59),
# # }

# CITY_COORDS ={}
# all_locations = pd.concat([internships_df['location'], users_df['location']])
# unique_locations_set = all_locations.unique()

# import requests

# for i in range(len(unique_locations_set)):
#   city=unique_locations_set[i]
#   search_query = f"{city}, India"
#   params = dict(
#     text=search_query,
#     apiKey=YOUR_API_KEY
#     )
#   url = 'https://api.geoapify.com/v1/geocode/search'

#   resp = requests.get(url=url, params=params)
#   data = resp.json()
#   x=data.get('features')
#   first_feature = x[0]

# # Access the 'properties' dictionary within that item
#   properties_dict = first_feature['properties']

# # Extract the 'lat' value from the properties dictionary
#   latitude = properties_dict['lat']
#   longtitude=properties_dict['lon']
#   CITY_COORDS[city]=(latitude,longtitude)







# def distance_to_similarity(city_a, city_b):
#     if city_a not in CITY_COORDS or city_b not in CITY_COORDS:
#         return 0
#     km = geodesic(CITY_COORDS[city_a], CITY_COORDS[city_b]).km
#     return math.exp(-km / LOCATION_DECAY_KM)

# # ----------------------------
# # Stipend Scaling
# # ----------------------------
# # scaler = MinMaxScaler()
# # internships["_stipend_scaled"] = scaler.fit_transform(internships[["stipend"]])

# # ----------------------------
# # Hybrid Score Function
# # ----------------------------
# def hybrid_score(candidate):
#     user_emb = model.encode([candidate["skills"]], normalize_embeddings=True)
#     text_sim = cosine_similarity(user_emb, item_embeddings).flatten()

#     loc_sim = np.array([
#         distance_to_similarity(candidate["location"].lower(), loc.lower())
#         for loc in internships["location"]
#     ])

#     # stipend_scaled = scaler.transform([[candidate["expected_stipend"]]])[0][0]
#     # stipend_sim = 1 - np.abs(stipend_scaled - internships["_stipend_scaled"].values.flatten())

#     # trend_sim = internships["trend"].values

#     # Affirmative Action Bonus
#     affirmative_bonus = AFFIRMATIVE_WEIGHT * (
#         candidate["rural"] + candidate["tribal"]
#     )

#     final_score = (
#         TEXT_WEIGHT * text_sim +
#         LOCATION_WEIGHT * loc_sim +
#         # STIPEND_WEIGHT * stipend_sim +
#         # TREND_WEIGHT * trend_sim +
#         affirmative_bonus
#     )
#     return final_score

# # ----------------------------
# # COST MATRIX (For Hungarian)
# # ----------------------------
# cost_matrix = []
# num=0
# for _, candidate in candidates.iterrows():
#     num=num+1
#     if(num%100==0):
#       print(num)
#     scores = hybrid_score(candidate)
#     cost_matrix.append(1 - scores)

# cost_matrix = np.array(cost_matrix)

# # ----------------------------
# # Hungarian Algorithm Allocation
# # ----------------------------
# row_ind, col_ind = linear_sum_assignment(cost_matrix)

# allocations = []
# count=0
# for r, c in zip(row_ind, col_ind):
#     count+=1
#     if(count%50==0):
#         print(count)
#     allocations.append({
#         "user_id": candidates.iloc[r]["user_id"],
#         "assigned_internship": internships.iloc[c]["title"],
#         "final_score": round(1 - cost_matrix[r][c], 4)
#     })
# def run_hungarian_allocation(users_df, internships_df):
#         TEXT_WEIGHT = 0.55
#         LOCATION_WEIGHT = 0.20
#         STIPEND_WEIGHT = 0.00
#         TREND_WEIGHT = 0.00
#         AFFIRMATIVE_WEIGHT = 0.05     # rural/tribal bonus

#         LOCATION_DECAY_KM = 50.0
#         # EMBED_MODEL_NAME = "all-MiniLM-L6-v2"
# #hwawerae
#         # ----------------------------
#         # Internships Dataset
#         # ----------------------------
#         # internships = pd.DataFrame([
#         #     {"internship_id": 1, "title":"Data Science Intern","description":"Python Machine Learning Data Analysis","location":"Delhi","stipend":15000,"trend":0.85,"capacity":1},
#         #     {"internship_id": 2, "title":"Web Dev Intern","description":"React Node Frontend","location":"Gurgaon","stipend":12000,"trend":0.75,"capacity":1},
#         #     {"internship_id": 3, "title":"AI Research Intern","description":"Deep Learning NLP Transformers","location":"Hyderabad","stipend":20000,"trend":0.65,"capacity":1},
#         #     {"internship_id": 4, "title":"Marketing Intern","description":"SEO Digital Marketing","location":"Delhi","stipend":8000,"trend":0.55,"capacity":1},
#         #     {"internship_id": 5, "title":"Backend Intern","description":"Python Django Microservices","location":"Bangalore","stipend":18000,"trend":0.90,"capacity":1},
#         # ])
#         candidate=users_df
#         internships=internships_df

#         # ----------------------------
#         # Enforce internship capacity
#         # ----------------------------
#         if "capacity" in internships.columns:
#             internships = internships.loc[
#             internships.index.repeat(internships["capacity"])
#             ].reset_index(drop=True)

#         # ----------------------------
#         # USERS (YOUR SCHEMA)
#         # ----------------------------



#         # candidates = pd.DataFrame([
#         #     {"user_id":101,"skills":"python ml data","location":"Delhi","education":"B.Tech","rural":0,"tribal":0,"category":"GEN","past_participation":0,"expected_stipend":15000},
#         #     {"user_id":102,"skills":"react node frontend","location":"Gurgaon","education":"B.Tech","rural":0,"tribal":0,"category":"OBC","past_participation":1,"expected_stipend":12000},
#         #     {"user_id":103,"skills":"nlp transformers","location":"Hyderabad","education":"M.Tech","rural":1,"tribal":0,"category":"SC","past_participation":0,"expected_stipend":19000},
#         #     {"user_id":104,"skills":"digital marketing seo","location":"Delhi","education":"MBA","rural":1,"tribal":1,"category":"ST","past_participation":0,"expected_stipend":9000},
#         #     {"user_id":105,"skills":"django backend python","location":"Bangalore","education":"B.Tech","rural":0,"tribal":0,"category":"GEN","past_participation":1,"expected_stipend":18000},
#         # ])

        
#         # ----------------------------
#         # Embeddings
#         # ----------------------------
#         # model = SentenceTransformer(EMBED_MODEL_NAME)
#         item_embeddings = MODEL.encode(
#             internships["description"].tolist(),
#             normalize_embeddings=True
#         )

#         # ----------------------------
#         # Location Utils
#         # ----------------------------
#         # CITY_COORDS = {
#         #     "delhi": (28.70, 77.10),
#         #     "gurgaon": (28.45, 77.02),
#         #     "hyderabad": (17.38, 78.48),
#         #     "bangalore": (12.97, 77.59),
#         # }

#         CITY_COORDS ={}
#         all_locations = pd.concat([internships['location'], candidate['location']])
#         unique_locations_set = all_locations.unique()

#         import requests
#         url = 'https://api.geoapify.com/v1/geocode/search'

#         for i in range(len(unique_locations_set)):
#             city=unique_locations_set[i]
#             search_query = f"{city}, India"
#             params = dict(
#                 text=search_query,
#                 apiKey=GEOAPIFY_API_KEY
#                 )
            

#             resp = requests.get(url=url, params=params)
#             data = resp.json()
#             x=data.get('features')
#             first_feature = x[0]

#             # Access the 'properties' dictionary within that item
#             properties_dict = first_feature['properties']

#             # Extract the 'lat' value from the properties dictionary
#             latitude = properties_dict['lat']
#             longtitude=properties_dict['lon']
#             CITY_COORDS[city]=(latitude,longtitude)







#         def distance_to_similarity(city_a, city_b):
#             if city_a not in CITY_COORDS or city_b not in CITY_COORDS:
#                 return 0
#             km = geodesic(CITY_COORDS[city_a], CITY_COORDS[city_b]).km
#             return math.exp(-km / LOCATION_DECAY_KM)

#         # ----------------------------
#         # Stipend Scaling
#         # ----------------------------
#         # scaler = MinMaxScaler()
#         # internships["_stipend_scaled"] = scaler.fit_transform(internships[["stipend"]])

#         # ----------------------------
#         # Hybrid Score Function
#         # ----------------------------
#         def hybrid_score(candidate):
#             user_emb = MODEL.encode([candidate["skills"]], normalize_embeddings=True)
#             text_sim = cosine_similarity(user_emb, item_embeddings).flatten()

#             loc_sim = np.array([
#                 distance_to_similarity(candidate["location"].lower(), loc.lower())
#                 for loc in internships["location"]
#             ])

#             # stipend_scaled = scaler.transform([[candidate["expected_stipend"]]])[0][0]
#             # stipend_sim = 1 - np.abs(stipend_scaled - internships["_stipend_scaled"].values.flatten())

#             # trend_sim = internships["trend"].values

#             # Affirmative Action Bonus
#             affirmative_bonus = AFFIRMATIVE_WEIGHT * (
#                 candidate["rural"] + candidate["tribal"]
#             )

#             final_score = (
#                 TEXT_WEIGHT * text_sim +
#                 LOCATION_WEIGHT * loc_sim +
#                 # STIPEND_WEIGHT * stipend_sim +
#                 # TREND_WEIGHT * trend_sim +
#                 affirmative_bonus
#             )
#             return final_score

#         cost_matrix = []
#         num=0
#         for _, user in candidate.iterrows():
#             num=num+1
#             if(num%100==0):
#                 print(num)
#             scores = hybrid_score(user)
#             cost_matrix.append(1 - scores)

#         cost_matrix = np.array(cost_matrix)

#         row_ind, col_ind = linear_sum_assignment(cost_matrix)

#         allocations = []
#         count=0
#         for r, c in zip(row_ind, col_ind):
#             count+=1
#             if(count%50==0):
#                 print(count)
#             allocations.append({
#                 "user_id": candidate.iloc[r]["user_id"],
#                 "assigned_internship": internships.iloc[c]["title"],
#                 "final_score": round(1 - cost_matrix[r][c], 4)
#             })
            
#         return (pd.DataFrame(allocations))  

# # allocation_df = run_hungarian_allocation(users_df, internships_df)

# allocation_df = pd.DataFrame(allocations)

# print("\n✅ FINAL OPTIMAL ALLOCATION USING HUNGARIAN ALGORITHM:\n")
# print(allocation_df)
# import math
# import numpy as np
# import pandas as pd
# from sklearn.preprocessing import MinMaxScaler
# from sklearn.metrics.pairwise import cosine_similarity
# from sentence_transformers import SentenceTransformer
# from geopy.distance import geodesic
# from scipy.optimize import linear_sum_assignment

# # ----------------------------
# # Weights
# # ----------------------------
# TEXT_WEIGHT = 0.55
# LOCATION_WEIGHT = 0.20
# STIPEND_WEIGHT = 0.00
# TREND_WEIGHT = 0.00
# AFFIRMATIVE_WEIGHT = 0.05     # rural/tribal bonus

# LOCATION_DECAY_KM = 50.0
# EMBED_MODEL_NAME = "all-MiniLM-L6-v2"

# # ----------------------------
# # Internships Dataset
# # ----------------------------
# # internships = pd.DataFrame([
# #     {"internship_id": 1, "title":"Data Science Intern","description":"Python Machine Learning Data Analysis","location":"Delhi","stipend":15000,"trend":0.85,"capacity":1},
# #     {"internship_id": 2, "title":"Web Dev Intern","description":"React Node Frontend","location":"Gurgaon","stipend":12000,"trend":0.75,"capacity":1},
# #     {"internship_id": 3, "title":"AI Research Intern","description":"Deep Learning NLP Transformers","location":"Hyderabad","stipend":20000,"trend":0.65,"capacity":1},
# #     {"internship_id": 4, "title":"Marketing Intern","description":"SEO Digital Marketing","location":"Delhi","stipend":8000,"trend":0.55,"capacity":1},
# #     {"internship_id": 5, "title":"Backend Intern","description":"Python Django Microservices","location":"Bangalore","stipend":18000,"trend":0.90,"capacity":1},
# # ])

# internships=internships_df
# # ----------------------------
# # USERS (YOUR SCHEMA)
# # ----------------------------



# # candidates = pd.DataFrame([
# #     {"user_id":101,"skills":"python ml data","location":"Delhi","education":"B.Tech","rural":0,"tribal":0,"category":"GEN","past_participation":0,"expected_stipend":15000},
# #     {"user_id":102,"skills":"react node frontend","location":"Gurgaon","education":"B.Tech","rural":0,"tribal":0,"category":"OBC","past_participation":1,"expected_stipend":12000},
# #     {"user_id":103,"skills":"nlp transformers","location":"Hyderabad","education":"M.Tech","rural":1,"tribal":0,"category":"SC","past_participation":0,"expected_stipend":19000},
# #     {"user_id":104,"skills":"digital marketing seo","location":"Delhi","education":"MBA","rural":1,"tribal":1,"category":"ST","past_participation":0,"expected_stipend":9000},
# #     {"user_id":105,"skills":"django backend python","location":"Bangalore","education":"B.Tech","rural":0,"tribal":0,"category":"GEN","past_participation":1,"expected_stipend":18000},
# # ])
# candidates=users_df
# # ----------------------------
# # Embeddings
# # ----------------------------
# model = SentenceTransformer(EMBED_MODEL_NAME)
# item_embeddings = model.encode(
#     internships["description"].tolist(),
#     normalize_embeddings=True
# )

# # ----------------------------
# # Location Utils
# # ----------------------------
# # CITY_COORDS = {
# #     "delhi": (28.70, 77.10),
# #     "gurgaon": (28.45, 77.02),
# #     "hyderabad": (17.38, 78.48),
# #     "bangalore": (12.97, 77.59),
# # }

# CITY_COORDS ={}
# all_locations = pd.concat([internships_df['location'], users_df['location']])
# unique_locations_set = all_locations.unique()

# import requests

# for i in range(len(unique_locations_set)):
#   city=unique_locations_set[i]
#   search_query = f"{city}, India"
#   params = dict(
#     text=search_query,
#     apiKey=YOUR_API_KEY
#     )
#   url = 'https://api.geoapify.com/v1/geocode/search'

#   resp = requests.get(url=url, params=params)
#   data = resp.json()
#   x=data.get('features')
#   first_feature = x[0]

# # Access the 'properties' dictionary within that item
#   properties_dict = first_feature['properties']

# # Extract the 'lat' value from the properties dictionary
#   latitude = properties_dict['lat']
#   longtitude=properties_dict['lon']
#   CITY_COORDS[city]=(latitude,longtitude)







# def distance_to_similarity(city_a, city_b):
#     if city_a not in CITY_COORDS or city_b not in CITY_COORDS:
#         return 0
#     km = geodesic(CITY_COORDS[city_a], CITY_COORDS[city_b]).km
#     return math.exp(-km / LOCATION_DECAY_KM)

# # ----------------------------
# # Stipend Scaling
# # ----------------------------
# # scaler = MinMaxScaler()
# # internships["_stipend_scaled"] = scaler.fit_transform(internships[["stipend"]])

# # ----------------------------
# # Hybrid Score Function
# # ----------------------------
# def hybrid_score(candidate):
#     user_emb = model.encode([candidate["skills"]], normalize_embeddings=True)
#     text_sim = cosine_similarity(user_emb, item_embeddings).flatten()

#     loc_sim = np.array([
#         distance_to_similarity(candidate["location"].lower(), loc.lower())
#         for loc in internships["location"]
#     ])

#     # stipend_scaled = scaler.transform([[candidate["expected_stipend"]]])[0][0]
#     # stipend_sim = 1 - np.abs(stipend_scaled - internships["_stipend_scaled"].values.flatten())

#     # trend_sim = internships["trend"].values

#     # Affirmative Action Bonus
#     affirmative_bonus = AFFIRMATIVE_WEIGHT * (
#         candidate["rural"] + candidate["tribal"]
#     )

#     final_score = (
#         TEXT_WEIGHT * text_sim +
#         LOCATION_WEIGHT * loc_sim +
#         # STIPEND_WEIGHT * stipend_sim +
#         # TREND_WEIGHT * trend_sim +
#         affirmative_bonus
#     )
#     return final_score

# # ----------------------------
# # COST MATRIX (For Hungarian)
# # ----------------------------
# cost_matrix = []
# num=0
# for _, candidate in candidates.iterrows():
#     num=num+1
#     if(num%100==0):
#       print(num)
#     scores = hybrid_score(candidate)
#     cost_matrix.append(1 - scores)

# cost_matrix = np.array(cost_matrix)

# # ----------------------------
# # Hungarian Algorithm Allocation
# # ----------------------------
# row_ind, col_ind = linear_sum_assignment(cost_matrix)

# allocations = []
# count=0
# for r, c in zip(row_ind, col_ind):
#     count+=1
#     if(count%50==0):
#         print(count)
#     allocations.append({
#         "user_id": candidates.iloc[r]["user_id"],
#         "assigned_internship": internships.iloc[c]["title"],
#         "final_score": round(1 - cost_matrix[r][c], 4)
#     })
def run_hungarian_allocation(users_df, internships_df):
        TEXT_WEIGHT = 0.55
        LOCATION_WEIGHT = 0.20
        STIPEND_WEIGHT = 0.00
        TREND_WEIGHT = 0.00
        AFFIRMATIVE_WEIGHT = 0.05     # rural/tribal bonus

        LOCATION_DECAY_KM = 50.0
        EMBED_MODEL_NAME = "all-MiniLM-L6-v2"

        # ----------------------------
        # Internships Dataset
        # ----------------------------
        # internships = pd.DataFrame([
        #     {"internship_id": 1, "title":"Data Science Intern","description":"Python Machine Learning Data Analysis","location":"Delhi","stipend":15000,"trend":0.85,"capacity":1},
        #     {"internship_id": 2, "title":"Web Dev Intern","description":"React Node Frontend","location":"Gurgaon","stipend":12000,"trend":0.75,"capacity":1},
        #     {"internship_id": 3, "title":"AI Research Intern","description":"Deep Learning NLP Transformers","location":"Hyderabad","stipend":20000,"trend":0.65,"capacity":1},
        #     {"internship_id": 4, "title":"Marketing Intern","description":"SEO Digital Marketing","location":"Delhi","stipend":8000,"trend":0.55,"capacity":1},
        #     {"internship_id": 5, "title":"Backend Intern","description":"Python Django Microservices","location":"Bangalore","stipend":18000,"trend":0.90,"capacity":1},
        # ])
        candidates=users_df
        internships=internships_df
        # ----------------------------
        # USERS (YOUR SCHEMA)
        # ----------------------------



        # candidates = pd.DataFrame([
        #     {"user_id":101,"skills":"python ml data","location":"Delhi","education":"B.Tech","rural":0,"tribal":0,"category":"GEN","past_participation":0,"expected_stipend":15000},
        #     {"user_id":102,"skills":"react node frontend","location":"Gurgaon","education":"B.Tech","rural":0,"tribal":0,"category":"OBC","past_participation":1,"expected_stipend":12000},
        #     {"user_id":103,"skills":"nlp transformers","location":"Hyderabad","education":"M.Tech","rural":1,"tribal":0,"category":"SC","past_participation":0,"expected_stipend":19000},
        #     {"user_id":104,"skills":"digital marketing seo","location":"Delhi","education":"MBA","rural":1,"tribal":1,"category":"ST","past_participation":0,"expected_stipend":9000},
        #     {"user_id":105,"skills":"django backend python","location":"Bangalore","education":"B.Tech","rural":0,"tribal":0,"category":"GEN","past_participation":1,"expected_stipend":18000},
        # ])

        
        # ----------------------------
        # Embeddings
        # ----------------------------
        model = SentenceTransformer(EMBED_MODEL_NAME)
        item_embeddings = model.encode(
            internships["description"].tolist(),
            normalize_embeddings=True
        )

        # ----------------------------
        # Location Utils
        # ----------------------------
        # CITY_COORDS = {
        #     "delhi": (28.70, 77.10),
        #     "gurgaon": (28.45, 77.02),
        #     "hyderabad": (17.38, 78.48),
        #     "bangalore": (12.97, 77.59),
        # }

        CITY_COORDS ={}
        all_locations = pd.concat([internships['location'], candidates['location']])
        unique_locations_set = all_locations.unique()

        import requests
        url = 'https://api.geoapify.com/v1/geocode/search'

        for i in range(len(unique_locations_set)):
            city=unique_locations_set[i]
            search_query = f"{city}, India"
            params = dict(
                text=search_query,
                apiKey=GEOAPIFY_API_KEY_API_KEY
                )
            

            resp = requests.get(url=url, params=params)
            data = resp.json()
            x=data.get('features')
            first_feature = x[0]

            # Access the 'properties' dictionary within that item
            properties_dict = first_feature['properties']

            # Extract the 'lat' value from the properties dictionary
            latitude = properties_dict['lat']
            longtitude=properties_dict['lon']
            CITY_COORDS[city]=(latitude,longtitude)







        def distance_to_similarity(city_a, city_b):
            if city_a not in CITY_COORDS or city_b not in CITY_COORDS:
                return 0
            km = geodesic(CITY_COORDS[city_a], CITY_COORDS[city_b]).km
            return math.exp(-km / LOCATION_DECAY_KM)

        # ----------------------------
        # Stipend Scaling
        # ----------------------------
        # scaler = MinMaxScaler()
        # internships["_stipend_scaled"] = scaler.fit_transform(internships[["stipend"]])

        # ----------------------------
        # Hybrid Score Function
        # ----------------------------
        def hybrid_score(candidate):
            user_emb = model.encode([candidate["skills"]], normalize_embeddings=True)
            text_sim = cosine_similarity(user_emb, item_embeddings).flatten()

            loc_sim = np.array([
                distance_to_similarity(candidate["location"].lower(), loc.lower())
                for loc in internships["location"]
            ])

            # stipend_scaled = scaler.transform([[candidate["expected_stipend"]]])[0][0]
            # stipend_sim = 1 - np.abs(stipend_scaled - internships["_stipend_scaled"].values.flatten())

            # trend_sim = internships["trend"].values

            # Affirmative Action Bonus
            affirmative_bonus = AFFIRMATIVE_WEIGHT * (
                candidate["rural"] + candidate["tribal"]
            )

            final_score = (
                TEXT_WEIGHT * text_sim +
                LOCATION_WEIGHT * loc_sim +
                # STIPEND_WEIGHT * stipend_sim +
                # TREND_WEIGHT * trend_sim +
                affirmative_bonus
            )
            return final_score
        


        expanded_internships = []

        for _, intern in internships.iterrows():
            for c in range(intern["capacity"]):
                expanded_internships.append({
                    "internship_id": intern["internship_id"],
                    "title": intern["title"],
                    "slot_id": f"{intern['internship_id']}_{c}"
                })

        expanded_internships = pd.DataFrame(expanded_internships)


        # Collect all applied internships
        valid_internship_ids = sorted(
                    set(
                iid
                for apps in candidates["applied_internships"]
                for iid in apps
                )
            )

        filtered_internships = expanded_internships[
            expanded_internships["internship_id"].isin(valid_internship_ids)
        ].reset_index(drop=True)








        # cost_matrix = []
        # num=0
        # for _, user in candidate.iterrows():
        #     num=num+1
        #     if(num%100==0):
        #         print(num)
        #     scores = hybrid_score(user)
        #     cost_matrix.append(1 - scores)

        # cost_matrix = np.array(cost_matrix)
        # BIG_COST = 1e6
        # cost_matrix = []

        # for _, candidate in candidates.iterrows():
        #     scores = hybrid_score(candidate)  # scores for ALL internships

        #     row_costs = []
        #     for idx, intern in filtered_internships.iterrows():
        #         if intern["internship_id"] in candidate["applied_internships"]:
        #             row_costs.append(1 - scores[intern.name])
        #         else:
        #             row_costs.append(BIG_COST)  # block assignment

        #     cost_matrix.append(row_costs)

        # cost_matrix = np.array(cost_matrix)

        BIG_COST = 1e6
        cost_matrix = []

        # Build mapping ONCE
        intern_id_to_idx = {
            iid: idx
            for idx, iid in enumerate(internships["internship_id"])
        }

        for _, candidate in candidates.iterrows():
            scores = hybrid_score(candidate)  # scores for ORIGINAL internships

            row_costs = []
            for _, intern in filtered_internships.iterrows():
                if intern["internship_id"] in candidate["applied_internships"]:
                    orig_idx = intern_id_to_idx[intern["internship_id"]]
                    row_costs.append(1 - scores[orig_idx])
                else:
                    row_costs.append(BIG_COST)  # block assignment

            cost_matrix.append(row_costs)

        cost_matrix = np.array(cost_matrix)


        row_ind, col_ind = linear_sum_assignment(cost_matrix)






        # allocations = []
        # count=0
        # for r, c in zip(row_ind, col_ind):
        #     count+=1
        #     if(count%50==0):
        #         print(count)
        #     allocations.append({
        #         "user_id": candidate.iloc[r]["user_id"],
        #         "assigned_internship": internships.iloc[c]["title"],
        #         "final_score": round(1 - cost_matrix[r][c], 4)
        #     })



        # row_ind, col_ind = linear_sum_assignment(cost_matrix)

        allocations = []
        for r, c in zip(row_ind, col_ind):
            if cost_matrix[r][c] < BIG_COST:
                allocations.append({
                    "user_id": candidates.iloc[r]["user_id"],
                    "assigned_internship": filtered_internships.iloc[c]["title"],
                    "score": round(1 - cost_matrix[r][c], 4)
                })




        return pd.DataFrame(allocations), np.array(cost_matrix)

# allocation_df ,cost= run_hungarian_allocation(users_df, internships_df)



# print("\n✅ FINAL OPTIMAL ALLOCATION USING HUNGARIAN ALGORITHM:\n")
# print(allocation_df)
