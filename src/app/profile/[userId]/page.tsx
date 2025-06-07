// src/app/profile/[userId]/page.tsx
import UserProfile from '@/components/profile/UserProfile';
import UserPosts from '@/components/profile/UserPosts';
import { getUserProfileData } from '@/lib/actions/profileActions';

export default async function ProfilePage({ 
  params 
}: { 
  params: Promise<{ userId: string }> 
}) {
  const { userId } = await params;
  const { profile, posts } = await getUserProfileData(userId);

  if (!profile) {
    return (
      <div className="text-center py-12">
        <h1 className="text-2xl font-bold">User Not Found</h1>
        <p className="text-muted-foreground">The user you are looking for does not exist or has been removed.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <UserProfile profile={profile} />
      
      <div className="bg-card p-4 rounded-lg shadow">
        <h2 className="text-xl font-semibold">Posts by {profile.name}</h2>
        <div className="space-y-4">
          {posts.length === 0 ? (
            <p className="text-muted-foreground">No posts found.</p>
          ) : (
            posts.map(post => (
              <div key={post.id} className="p-4 bg-secondary rounded-lg shadow-sm">
                <h3 className="text-lg font-semibold">{post.title}</h3>
                <p className="text-sm text-muted-foreground">{post.content.substring(0, 100)}...</p>
                <Link href={`/forum/${post.threadId}`} className="text-primary hover:underline">
                  Read more
                </Link>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}