import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DummyProfileSettings = () => {
  return (
    <Card className="overflow-hidden border-none shadow-lg">
      <CardHeader className="bg-gradient-to-r from-indigo-600 to-purple-600">
        <CardTitle className="text-white">Dummy Profile</CardTitle>
      </CardHeader>
      <CardContent className="p-6">
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 border-4 border-gray-300 rounded-full overflow-hidden shadow-lg">
            <img src="/profilepictureexample.jpeg" alt="Profile" className="w-full h-full object-cover" />
          </div>
        </div>
        <div className="mt-6">
          <div className="text-center text-lg font-semibold">Dummy Component</div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DummyProfileSettings;