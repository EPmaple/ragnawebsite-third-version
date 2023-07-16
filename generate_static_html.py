from jinja2 import Environment, FileSystemLoader
import helpers, ragna_data.data as data
import os
import json

# Define the path to your templates directory
#templates_dir = 'templates'

# Specify the folder path for the generated HTML files
output_folder = 'website'

# Create a Jinja2 environment
env = Environment(loader=FileSystemLoader("templates/"))

######################################################
######################################################

# Define the season numbers for which you want to generate static HTML
season_numbers = ['18', '19', '20', '21', '22', '23', '24', 
                  '25', '25.5', '26', '27', '28', '29', '30',
                  '31', '32', '33', '34', '34.5', '35', '36',
                  '37']  

subfolder_name = f'ragna_season'
seasonal_tops = {}

for season_number in season_numbers:
  #season_data is a list of items, do item.slimes, item.zoom, etc.
  #to access the elements within the items
  season_data = helpers.get_season_data(season_number)
  #print(f'season number is {season_number} and the following are data: {season_data}\n') 
  helpers.ranking_slimes(season_data) #adds ranking element to each item in season_data based on slime count
  # ex. {'id': 64, 'name': 'variant-iv', 'slimes': 31, 'zooms': 0, 'ranking_slimes': 7}
  
  file_prefix = f's{season_number}' #ex. s18
  # Load the season template
  template = env.get_template('season.html')

  #calculate needed data
  sum_of_slimes, average_of_slimes = helpers.listize(season_data, 'slimes')
  sum_of_zooms, average_of_zooms = helpers.listize(season_data, 'zooms')
  top_members = helpers.top_members(season_data)
  json_datastring = json.dumps(season_data)

  if sum_of_zooms == 0:
    sum_of_zooms = 'not applicable'
    average_of_zooms = 'not applicable'

  # Render the template with the data
  rendered_html = template.render(
    title = f"ragna s{season_number}",
    sum_of_slimes = sum_of_slimes,
    average_of_slimes = average_of_slimes,
    sum_of_zooms = sum_of_zooms,
    average_of_zooms = average_of_zooms,
    top_members = top_members,
    json_datastring = json_datastring,
    season_number=season_number, season_data=season_data)
  
  filename = file_prefix + '.html' #ex. s18.html
  file_path = os.path.join(output_folder, subfolder_name, filename)
  # Create the subfolder if it doesn't exist
  os.makedirs(os.path.dirname(file_path), exist_ok=True)

  # Generate a static HTML file for the season
  #os.path.join(output_folder, filename)
  with open(file_path, mode='w') as file:
    file.write(rendered_html)
    #print(f"... wrote {filename}"")

  # at the end of the for loop for one season
  seasonal_top = helpers.ranking(season_data) # seasonal_top is a list
  seasonal_tops[season_number] = seasonal_top
  # seasonal_tops example output: {'18': ['Link2D3atH'], '19': ['zero'], '20': ['Vent'], '21': ['zero'], '22': ['zero'], '23': ['TraffyBoi'], '24': ['TraffyBoi'], '25': ['TraffyBoi'], '25.5': ['TraffyBoi'], '26': ['TraffyBoi'], '27': ['TraffyBoi'], '28': ['TraffyBoi'], '29': ['TraffyBoi'], '30': ['Kenshin'], '31': ['traffyboi'], '32': ['Thaelon'], '33': ['Thaelon'], '34': ['Thaelon'], '34.5': ['zero'], '35': ['Thaelon', 'traffyboi'], '36': ['Thaelon'], '37': ['Thaelon']}

most_common_names, max_frequency = helpers.most_common_name(seasonal_tops)
# convert the list to a string with comma as the delimiter
most_common_names = ', '.join(most_common_names)
  
# print(most_common_names, max_frequency) # ['traffyboi'] 10
most_streak_names, max_streak = helpers.most_streak_names(seasonal_tops)
most_streak_names = ', '.join(most_streak_names)
# print(most_streak_names, max_streak) # ['traffyboi'] 8
######################################################
######################################################

# Load the home template
template = env.get_template('index.html')

index_data = []

for season_number in season_numbers:
  #initialization to obtain the necessary data
  season_data = helpers.get_season_data(season_number)
  members = len(season_data)
  sum_of_slimes, average_of_slimes = helpers.listize(season_data, 'slimes')
  sum_of_zooms, average_of_zooms = helpers.listize(season_data, 'zooms')

  number_members_slimes_zooms = {'season_number': season_number, 'members': members, 'slimes': sum_of_slimes, 'zooms': sum_of_zooms}

  index_data.append(number_members_slimes_zooms)


# Render the home template (if it requires data, pass it as arguments to template.render())
rendered_html = template.render(
  index_data = index_data,
  most_common_names = most_common_names,
  max_frequency = max_frequency,
  most_streak_names = most_streak_names,
  max_streak = max_streak
)

# Generate a static HTML file for the home page
with open(os.path.join(output_folder, 'index.html'), mode='w') as file:
    file.write(rendered_html)
