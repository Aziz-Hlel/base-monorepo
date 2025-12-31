-- cchange the way you use query params to fetch data , instead of making the query key derived from the query params itself , add a zod in the middle , the query key and payload will have the validated schema data so that if a user input size=2 in the browser it ll be corrected and send to the backend correct and aswell registred as the query key since it s actually the one that been sent as well as you can update now and correct it in the seachParams without resulting to another refetch or anything since it s decioupled form the query and has a middlewre that vlaidates first

-- maybe add a default onError function for useQuery ? but be careful and confirm if it return that iwthout hrowing an error and if that good in the first place

-- the diable and enable a bit sloppy , just make sure the user will be diabled afterwards and can login as well if he already loged and have a valid access token
