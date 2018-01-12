names = "Cinzia Zuffada
Mingsheng Wei
Sabrina Feldman
Minta Akin
Erin Angel
Alison Baski"

names = names.split("\n")
names = names.map do |name|
  "
  {
    'name': 'Dr. #{name}',
    'role': '',
    'affiliation': ''
  }"
end.join(",").gsub! "'", '"'

puts names
