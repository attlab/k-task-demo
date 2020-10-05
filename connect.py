import psycopg2 as psycopg2
import os 

class HandleData():
	# this class is used to connect and send data to the database specifieed by 
	# the environment variable 'DATABASE_URL'. environment variables are stored 
	# in a file called '.env' in the root directory.  
	def __init__(self):
		database_url = os.environ['DATABASE_URL']
		self.database_url = database_url

	def addData(self,participant_id,block,trial,trial_resp,trial_rt,trial_acc,change):
		# connect to the database
		conn = psycopg2.connect(self.database_url, sslmode='require')
		cur = conn.cursor()

		# get the number of entries (id's) in the database
		cur.execute( "SELECT id FROM ktask_heroku_data" )		
		for row in cur:
			x = row

		# create a new id at the next position
		id = x[0]+1
		print(id)

		try:
			# insert the data as a new row in the databasee
			cur.execute( f"INSERT INTO ktask_heroku_data (id,participant_id,block,trial,trial_resp,trial_rt,trial_acc,change) VALUES ({id},{participant_id},{block},{trial},'{trial_resp}',{trial_rt},{trial_acc},'{change}');" )
			# commit the change
			conn.commit()
			print(f"added data for id {id}")
			
		except (Exception, psycopg2.DatabaseError) as error:
			# get error messages
			print(error)

		finally:
			if conn is not None:
				# close the connection to the database
				conn.close()

	def getData(self):
		conn = psycopg2.connect(self.database_url, sslmode='require')
		cur = conn.cursor()
		cur.execute("SELECT * FROM ktask_heroku_data")

		for row in cur:
			print(row)

		conn.close()

	





