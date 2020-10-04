import psycopg2 as psycopg2
import os 

hostname = 'localhost'
username = 'dannytoomey'
password = 'ktaskdemo2pass'
database = 'ktaskdemo2'

class HandleData():
	def __init__(hostname,username,password,dbname):
		self.hostname = hostname
		self.username = username
		self.password = password
		self.dbname = dbname

	def getData():
		conn = psycopg2.connect( host=hostname, user=username, password=password, dbname=database )
		cur = conn.cursor()
		cur.execute( "SELECT * FROM ktask_data" )
		
		for row in cur:
			print(row)

		conn.close()

	def addData(participant_id,block,trial,trial_resp,trial_rt,trial_acc):
		
		conn = psycopg2.connect( host=hostname, user=username, password=password, dbname=database )
		cur = conn.cursor()

		cur.execute( "SELECT id FROM ktask_data" )		
		for row in cur:
			x = row

		id = x[0]+1
		print(id)

		try:

			cur.execute( f"INSERT INTO ktask_data (id,participant_id,block,trial,trial_resp,trial_rt,trial_acc) VALUES ({id},{participant_id},{block},{trial},'{trial_resp}',{trial_rt},{trial_acc});" )
			conn.commit()
			print(f"added data for id {id}")
			
		except (Exception, psycopg2.DatabaseError) as error:
			print(error)

		finally:
			if conn is not None:
				conn.close()


HandleData.getData()    






